var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/authorize', function(req, res, next) {
  res.json({ foo: 'bar' })
});

module.exports = router;
