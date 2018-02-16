var express = require('express');
var adminRouter = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');

adminRouter.get('/', flog, (req,res) => {
  switch (req.valid) {
    case 1:
      res.render('admin/views/index');
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/Active', flog, (req,res)=>{
  switch (req.valid) {
    case 1:
      db.query(`SELECT * FROM tbluser WHERE boolIsBanned=0`, (err, results, fields) => {
        if(err) return console.log(err)
        results= results.filter(function(record) {return record.intType !== 1});
        console.log(results.length);
        return res.render('admin/views/Active', {resultspug: results});
      });
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/Banned/:username', flog, (req,res)=>{
  switch (req.valid) {
    case 1:
      db.query(`UPDATE tbluser SET boolIsBanned = 1 WHERE strUserName = ?`, [req.params.username], (err, results, fields) =>{
        if(err) return console.log(err)
        return res.redirect('/admin/Active');
      });
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/Banned', flog, (req,res) =>{
  switch (req.valid) {
    case 1:
      db.query(`SELECT intAccNo, strUserName, strName, strEmail, strContactNo FROM tbluser WHERE boolIsBanned = 1`, (err, results, fields) => {
        if(err) return console.log(err)
        return res.render('admin/views/Banned', {resultspug: results});
      });
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/Unbanned/:username', flog, (req, res)=>{
  switch (req.valid) {
    case 1:
      db.query(`UPDATE tbluser SET boolIsBanned = 0 WheRE strUserName = ?`, [req.params.username], (err,results, fields) =>{
        if(err) return console.log(err)
        return res.redirect('/admin/Banned')
      });
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
})

adminRouter.get('/ReportedUsers', flog, (req,res) => {
  switch (req.valid) {
    case 1:
      res.render('admin/views/ReportedUsers');
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/ReportLog', flog, (req,res) => {
  switch (req.valid) {
    case 1:
      res.render('admin/views/ReportLog');
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/IDVerification', flog, (req,res) => {
  switch (req.valid) {
    case 1:
      res.render('admin/views/IDVerification');
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/TransactionLog', flog, (req,res) => {
  switch (req.valid) {
    case 1:
      res.render('admin/views/TransacLog');
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

exports.admin = adminRouter;
