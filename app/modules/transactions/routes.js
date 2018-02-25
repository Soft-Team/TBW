var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var messCount = require('../welcome/messCount');

function ongoingRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('transactions/views/ongoing', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}
function finishedRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('transactions/views/finished', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}
function logRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('transactions/views/log', {thisUserTab: req.user, messCount: req.messCount[0].count});
      break;
  }
}

router.get('/ongoing', flog, messCount, ongoingRender);
router.get('/finished', flog, messCount, finishedRender);
router.get('/log', flog, messCount, logRender);

exports.transactions = router;
