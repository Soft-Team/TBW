var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');

function render(req,res){
  res.render('profile/views/index');
}

router.get('/:username', flog, render);

exports.profile = router;
