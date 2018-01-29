var express = require('express');
var adminRouter = express.Router();
var db = require('../../lib/database')();


adminRouter.get('/', (req,res) => {
  res.render('admin/views/index');
});

adminRouter.get('/Active', (req,res)=>{
  db.query(`SELECT * FROM tbluser WHERE boolIsBanned=0`, (err, results, fields) => {
    if(err) return console.log(err)
    results= results.filter(function(record) {return record.intType !== 1});
    console.log(results.length);
    return res.render('admin/views/Active', {resultspug: results});
  })
});

adminRouter.get('/Banned/:username', (req,res)=>{
  db.query(`UPDATE tbluser SET boolIsBanned = 1 WHERE strUserName = ?`, [req.params.username], (err, results, fields) =>{
    if(err) return console.log(err)
    return res.redirect('/admin/Active');
  })
});

adminRouter.get('/Banned', (req,res) =>{
  db.query(`SELECT intAccNo, strUserName, strName, strEmail, strContactNo FROM tbluser WHERE boolIsBanned = 1`, (err, results, fields) => {
    if(err) return console.log(err)
    return res.render('admin/views/Banned', {resultspug: results});
  })
});

adminRouter.get('/Unbanned/:username', (req, res)=>{
  db.query(`UPDATE tbluser SET boolIsBanned = 0 WheRE strUserName = ?`, [req.params.username], (err,results, fields) =>{
    if(err) return console.log(err)
    return res.redirect('/admin/Banned')
  })
})

exports.admin = adminRouter;
