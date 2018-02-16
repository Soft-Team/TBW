var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');

function render(req,res){
  res.render('invoice/views/index');
}

router.get('/', flog, render);

exports.invoice = router;
