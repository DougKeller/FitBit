var express = require('express');
var router = express.Router();

var constants = require('../config/oauth');
var port = process.env.PORT || 3000

var oauth2 = require('simple-oauth2')({
  clientID: constants.clientId,
  clientSecret: constants.secret,
  site: constants.site,
  tokenPath: constants.tokenPath,
  authorizationPath: constants.authorizePath
})

var authorizationUri = oauth2.authCode.authorizeURL({
  redirect_uri: 'http://127.0.0.1:' + port + '/authenticated',
  scope: constants.scope
})

router.get('/authorize', function(req, res) {
  res.json(authorizationUri)
});

router.get('/authenticated', function(req, res) {
  var code = req.query.code
  oauth2.authCode.getToken({
    code: code,
    redirect_uri: 'http://127.0.0.1:' + port + '/authenticated'
  }, saveToken)

  function saveToken(error, result) {
    if(error || !result) {
      console.log('Access Token Error', error.message)
      res.status(500).send('Access Token Error')
    } else {
      token = oauth2.accessToken.create(result)
      res.json(token)
    }
  }
})

module.exports = router;
