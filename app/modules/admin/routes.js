var express = require('express');
var adminRouter = express.Router();
var db = require('../../lib/database')();


adminRouter.get('/', (req,res) => {
  res.render('admin/views/index');
});

adminRouter.get('/Active', (req,res)=>{
  db.query('SELECT * FROM tbluser', (err, results, fields) => {
    if(err) return console.log(err)
    results= results.filter(function(record) {return record.intType !== 1});
    console.log(results.length);
    return res.render('admin/views/Active', {resultspug: results});
  })
});



exports.admin = adminRouter;
