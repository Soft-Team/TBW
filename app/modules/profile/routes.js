var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var messCount = require('../welcome/messCount');
var numberFormat = require('../welcome/numberFormat');
var fs = require('fs');
var prepend = require('../welcome/prepend');

function paramsUser(req, res, next){
  /*All Service Tags of Selected User, Match(params)
  *(tblservicetag)*(tblservice)*(tbluser)*/
  db.query("SELECT * FROM tbluser LEFT JOIN tblservice ON intAccNo= intServAccNo LEFT JOIN tblservicetag ON intServTag= intServTagID WHERE intAccNo= ?",[req.params.userid], function (err, results, fields) {
      if (err) return res.send(err);
      if(!(!results[0])){
        for(count=0;count<results.length;count++){
          results[count].prepend = prepend(results[count].intAccNo);
          results[count].current = 0;
          if(results[count].intAccNo == req.session.user){
            results[count].current = 1;
          }
        }
        req.servempty = 1;
        if(!(!results[0].intServAccNo)){
          req.servempty = 0;
          for(count=0;count<results.length;count++){
            results[count].formatPrice = numberFormat(results[count].fltPrice.toFixed(2));
          }
        }
      }
      req.paramsUser = results;
      return next();
  });
}

function render(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      res.redirect('/profile/'+req.session.user);
      break;
  }
}
function profRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if(!req.paramsUser[0]){
        res.redirect('/noroute');
      }
      else{
        res.render('profile/views/index',{thisUserTab: req.user, messCount: req.messCount[0].count, paramsUser: req.paramsUser, servempty: req.servempty});
      }
      break;
  }
}

router.get('/', flog, messCount, render);
router.get('/:userid', flog, messCount, paramsUser, profRender);

exports.profile = router;
