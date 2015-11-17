var router = require('express').Router();
var api = require('../resources/api')

router.get('/series', function(req, res) {
	var url = 'https://api.fitbit.com/1/user/-/activities/heart/date/today/1w.json'
	api.get(url, req, res)
})

module.exports = router;
