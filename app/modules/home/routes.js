var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var messCount = require('../welcome/messCount');

function render(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('home/views/index', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}
function guideRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('home/views/guide', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}
function helpRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('home/views/help', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}
function aboutRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('home/views/about', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}
function teamRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('home/views/team', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}

router.get('/', flog, messCount, render);
router.get('/guide', flog, messCount, guideRender);
router.get('/help', flog, messCount, helpRender);
router.get('/about', flog, messCount, aboutRender);
router.get('/team', flog, messCount, teamRender);

exports.home = router;
