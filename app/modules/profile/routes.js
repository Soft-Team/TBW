var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  res.render('profile/views/index');
}

function render(req,res){
  res.render('profile/views/services');
}

router.get('/:username', render);

exports.profile = router;
