var data = require('../config/oauth');
var oauth2 = require('simple-oauth2')(data.credentials);
var accessToken = require('./access_token');

module.exports = {
	get: function(path, req, res) {
		var token = accessToken(req.session);
		if(!token) {
			res.status(401).json('unauthorized')
			return
		}

		console.log('GET', path, { access_token: token.token.access_token })
		oauth2.api('GET', path, { access_token: token.token.access_token }).then(function(response) {
			if(response.errors) {
				res.status(502).json(response)
			} else {
				res.status(200).json(response)
			}
		})
	}
}