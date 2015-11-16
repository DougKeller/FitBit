var express = require('express');
var router = express.Router();

var data = require('../config/oauth');
var accessToken = require('../resources/access_token')

var port = process.env.PORT || 3000
var rootUrl = process.env.ROOT_URL || ('http://127.0.0.1:' + port)

var oauth2 = require('simple-oauth2')(data.credentials);
function authUri(root) {
  return oauth2.authCode.authorizeURL({
    redirect_uri: root + 'authenticated',
    scope: data.scope
  })
}

router.get('/authorize', function(req, res) {
  if(accessToken(req.session)) {
    res.status(200).send('Authenticated')
  } else {
    res.status(302).json(authUri(req.query.url))
  }
});

router.get('/authenticated', function(req, res) {
  var code = req.query.code
  oauth2.authCode.getToken({
    code: code,
    redirect_uri: rootUrl + '/authenticated' // Redirected to by client browser
  }, saveToken)

  function saveToken(error, result) {
    if(error) {
      res.status(500).json(error.message)
    } else {
      var token = oauth2.accessToken.create(result)
      if(token) {
        req.session.token = token
        res.status(200).render('authenticated')
      } else {
        res.status(500).render('authenticated')
      }
    }
  }
})

module.exports = router;
