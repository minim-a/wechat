var express = require('express');
var router = express.Router();
let unit = require('../models/unit');

/* GET home page. */
router.get('/', function(req, res, next) {
   //res.render('visitor',{action:'//visitor',show:'none',btn:'确认'});
  unit.showHint(res,"aaaa");
  res.render('index');
});

/* GET home page. */
router.get('/test', function(req, res, next) {

  res.render('test');
});


module.exports = router;
