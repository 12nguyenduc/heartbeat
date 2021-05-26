var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  global.lastPing = new Date().getTime();
  res.json({data: 'ok'})
});

module.exports = router;
