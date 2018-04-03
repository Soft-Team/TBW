var express = require('express');
var adminRouter = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var fs = require('fs');
var dateformat = require('../welcome/dateformat');

function selectedUser(req,res,next){
  /*Selected User, Match(params);
  *(tbluser)*/
  db.query("SELECT * FROM tbluser WHERE strUserName= ?",[req.params.username], (err, results, fields) => {
      if (err) console.log(err);
      req.selectedUser= results;
      return next();
    });
}

adminRouter.get('/', flog, (req,res) => {
  switch (req.valid) {
    case 1:
      /*res.render('admin/views/index');*/
      res.redirect('/admin/Active');
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
      db.query(`SELECT * FROM tbluser WHERE boolIsBanned= 0 AND (((intStatus= 1 OR intStatus= 2) AND intType!= 3) OR (intStatus= 2 AND intType= 3))`,  (err, results, fields) => {
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

adminRouter.get('/Banned/:userid', flog, (req,res)=>{
  switch (req.valid) {
    case 1:
      db.beginTransaction(function(err) {
        if (err) console.log(err);
        db.query(`UPDATE tbluser SET boolIsBanned = 1 WHERE intAccNo = ?`, [req.params.userid], function (err,  results, fields) {
            if (err) console.log(err);
            console.log(req.params.userid);
            db.query(`UPDATE tblreport SET intRepStatus = 0 WHERE intRepedAccNo = ?`, [req.params.userid], (err,results,fields)=>{
                if (err) console.log(err);
                db.commit(function(err) {
                    if (err) console.log(err);
                    res.redirect('/admin/Active');
                });
            });
        });
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

adminRouter.get('/Unregistered', flog, (req, res)=>{
  switch (req.valid) {
    case 1:
      db.query(`SELECT * FROM tbluser WHERE boolIsBanned=0 AND (intType = 3 AND intStatus = 1)`,  (err, results, fields) => {
        if(err) return console.log(err)
        results= results.filter(function(record) {return record.intType !== 1});
        console.log(results.length);
        return res.render('admin/views/Unregistered', {resultspug: results});
      });
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/Unregistered/Accept/:username' , flog, (req, res)=>{
  switch (req.valid) {
    case 1:
      db.query(`UPDATE tbluser SET intStatus = 2 WHERE strUserName = ?`, [req.params.username], (err, results, fields) =>{
        if(err) return console.log(err)
        return res.redirect('/admin/Unregistered');
      });
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/Unregistered/Decline/:username', flog, (req,res) =>{
  switch (req.valid) {
    case 1:
      db.query(`UPDATE tbluser SET intStatus = 3 WHERE strUserName = ?`, [req.params.username], (err, results, fields) =>{
        if(err) return console.log(err)
        return res.redirect('/admin/Unregistered');
      });
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/Declined', flog, (req, res) => {
  switch (req.valid) {
    case 1:
      db.query(`SELECT * FROM tbluser WHERE intStatus = 3`,  (err, results, fields) => {
        if(err) return console.log(err)
        results= results.filter(function(record) {return record.intType !== 1});
        console.log(results.length);
        return res.render('admin/views/Declined', {resultspug: results});
      });
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
    db.query(`SELECT tblreport.*, (Reped.strName)AS ReportedName, (Reped.strUserName)AS ReportedUserName, (Reped.boolIsBanned)AS ReportedisBanned ,
    (Reporter.strName)AS ReporterName, (Reporter.strUserName)AS ReporterUserName FROM dbtrabawho.tblreport
    INNER JOIN(SELECT * FROM tbluser WHERE boolIsBanned= 0)Reped ON intRepedAccNo= Reped.intAccNo
    INNER JOIN(SELECT * FROM tbluser)Reporter ON intReporterAccNo= Reporter.intAccNo WHERE intRepStatus = 1 ORDER BY intRepID DESC;  `, (err, results, fields) => {
      if(err) return console.log(err)
      console.log(results);
      if(!(!results[0])){
        for(count=0;count<results.length;count++){
          results[count].formatDate = (results[count].datRepDate).toDateString("en-US").slice(4, 15);
        }
      }
      return res.render('admin/views/ReportLog', {resultspug: results});
    });
    break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/ReportedUsers', flog, (req,res) => {
  switch (req.valid) {
    case 1:
    db.query(`SELECT Total.*, IFNULL(CurrentCNT,0)CurrentCNT
    FROM (SELECT intAccNo, strUserName, boolIsBanned, COUNT(intAccNo)TotalCNT FROM tbluser INNER JOIN tblreport ON intAccNo= intRepedAccNo WHERE boolIsBanned= 0 GROUP BY intAccNo)Total
    LEFT JOIN (SELECT COUNT(intAccNo)CurrentCNT, intAccNo FROM tbluser INNER JOIN tblreport ON intAccNo= intRepedAccNo WHERE intRepStatus= 1 AND boolIsBanned= 0 GROUP BY intAccNo)Current
    ON Total.intAccNo= Current.intAccNo ORDER BY CurrentCNT DESC`, (err, results, fields) => {
      if(err) return console.log(err)
      console.log(results);
      return res.render('admin/views/ReportedUsers', {resultspug: results});
    });
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
      db.query(`SELECT * FROM tbluser WHERE boolIsBanned=0 AND intType = 2 AND intStatus = 1 AND strValidID IS NOT NULL`,  (err, results, fields) => {
        if(err) return console.log(err)
        console.log(results.length);
        return res.render('admin/views/IDVerification', {resultspug: results});
      });
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/IDVerification/Approved/:username', flog, (req, res) => {
  switch (req.valid) {
    case 1:
      db.query(`UPDATE tbluser SET intStatus = 2 WHERE strUserName = ?`, [req.params.username], (err, results, fields) =>{
        if(err) return console.log(err)
        return res.redirect('/admin/IDVerification');
      });
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});

adminRouter.get('/IDVerification/Declined/:username', flog, selectedUser, (req, res) => {
  switch (req.valid) {
    case 1:
      db.beginTransaction(function(err) {
        if (err) console.log(err);
        fs.unlink('public/userImages/ids/'+req.selectedUser[0].strValidID);
        db.query("SELECT * FROM tbluser WHERE strUserName= ?",[req.params.username], (err, results, fields) => {
            db.query(`UPDATE tbluser SET strValidID = null WHERE strUserName = ?`, [req.params.username], (err, results, fields) =>{
              if (err) console.log(err);
              db.commit(function(err) {
                  if (err) console.log(err);
                  res.redirect('/admin/IDVerification');
              });
            });
        });
      });
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

adminRouter.get('/Cancelled', flog, (req,res) => {
  switch (req.valid) {
    case 1:
    db.query(`SELECT tblcancellation.*, Cancel.*, Canceled.*, tblservicetag.strServName, tbltransaction.* FROM dbtrabawho.tblcancellation INNER JOIN tblchat ON intCancelChatID= intChatID INNER JOIN tblservice ON intServID= intChatServ
    INNER JOIN(SELECT (intAccNo)CancelNo, (strName)CancelName FROM  tbluser)Cancel ON intCancelAccNo= Cancel.CancelNo
    INNER JOIN(SELECT (intAccNo)CanceledNo, (strName)CanceledName FROM  tbluser)Canceled ON
    (intChatSeeker= Canceled.CanceledNo OR intServAccNo= Canceled.CanceledNo) AND (Canceled.CanceledNo!= intCancelAccNo)
    INNER JOIN tblservicetag ON intServTag= intServTagID
    LEFT JOIN tbltransaction ON intChatID= intTransChatID`, (err, results, fields) => {
      if(err) return console.log(err)
      console.log(results);
      return res.render('admin/views/Cancelled', {resultspug: results});
    });
      break;
    case 2:
    case 3:
      res.render('welcome/views/invalid/restrict');
      break;
  }
});
exports.admin = adminRouter;
