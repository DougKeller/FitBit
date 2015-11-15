var express = require('express');
var router = express.Router();

var constants = require('../config/oauth');
var port = process.env.PORT || 3000

function oauth2() {
  return require('simple-oauth2')({
    clientID: constants.clientId,
    clientSecret: constants.secret,
    site: constants.site,
    tokenPath: constants.tokenPath,
    authorizationPath: constants.authorizePath
  })
}

function authUri(root) {
  return oauth2().authCode.authorizeURL({
    redirect_uri: root + 'authenticated',
    scope: constants.scope
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
  oauth2().authCode.getToken({
    code: code,
    redirect_uri: 'http://127.0.0.1:' + port + '/authenticated'
  }, saveToken)

  function saveToken(error, result) {
    if(error || !result) {
      console.log('Access Token Error', error.message)
      res.status(500).send('Access Token Error')
    } else {
      req.session.token = oauth2.accessToken.create(result)
      res.json(req.session.token)
    }
  }
})

module.exports = router;
