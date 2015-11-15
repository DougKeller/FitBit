var express = require('express');
var router = express.Router();

var data = require('../config/oauth');
var port = process.env.PORT || 3000

var oauth2 =  require('simple-oauth2')(data.credentials)
function authUri(root) {
  return oauth2.authCode.authorizeURL({
    redirect_uri: root + 'authenticated',
    scope: data.scope
  })
}

router.get('/authorize', function(req, res) {
  if(req.session.token) {
    res.json(req.session.token)
  } else {
    res.json(authUri(req.query.url))
  }
});

router.get('/authenticated', function(req, res) {
  var code = req.query.code
  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://127.0.0.1:' + port + '/authenticated'
  }, saveToken)

  function saveToken(error, result) {
    if(error) {
      console.log('Access Token Error', error.message)
      res.status(500).json(error.message)
    } else {
      var token = oauth2.accessToken.create(result)
      if(token) {
        req.session.token = token
        res.status(200).send('Authenticated')
      } else {
        res.status(500).send('Authentication Failed')
      }
    }
  }
})

module.exports = router;
