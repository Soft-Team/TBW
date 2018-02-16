var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');

function render(req,res){
  res.redirect('/profile/'+req.session.user);
}

function profileRender(req,res){
  res.render('profile/views/index', {thisUserTab: req.user});
}

router.get('/', flog, render);
router.get('/:accno', flog, profileRender);

exports.profile = router;
