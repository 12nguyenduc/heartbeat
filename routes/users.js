var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  global.lastPing = new Date().getTime();
  res.send('respond with a resource');
});

module.exports = router;
