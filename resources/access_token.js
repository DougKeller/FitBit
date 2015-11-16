var data = require('../config/oauth');
var oauth2 = require('simple-oauth2')(data.credentials);

module.exports = function(session) {
	if(!(session && session.token)) {
		return null;
	}
	session.token = oauth2.accessToken.create(session.token.token)

	if(session.token.expired()) {
		session.token.refresh(function(error, result) {
			session.token = result
		})
	}

	return session.token
}