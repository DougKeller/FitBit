var router = require('express').Router();
var token = require('../resources/access_token');

router.get('/series', function(req, res) {
	var accessToken = token(req.session)
	if(!accessToken) {
		res.status(401).json('unauthorized')
	} else {
		res.json(accessToken)
	}
})

module.exports = router;