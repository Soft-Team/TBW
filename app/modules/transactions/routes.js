var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');

function ongoingRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.render('transactions/views/ongoing', {thisUserTab: req.user});
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
      res.render('transactions/views/finished', {thisUserTab: req.user});
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
      res.render('transactions/views/log', {thisUserTab: req.user});
      break;
  }
}

router.get('/ongoing', flog, ongoingRender);
router.get('/finished', flog, finishedRender);
router.get('/log', flog, logRender);

exports.transactions = router;
