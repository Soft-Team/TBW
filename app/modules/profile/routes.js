var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  res.render('profile/views/index');
}

router.get('/:username', render);

exports.profile = router;
