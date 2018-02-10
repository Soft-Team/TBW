var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var loggedin = require('../welcome/loggedin');

function render(req,res){
  res.render('home/views/index');
}

router.get('/', loggedin, render);

exports.home = router;
