var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var flog = require('../welcome/loggedin');
var prepend = require('../welcome/prepend');

function servTags(req, res, next){
  /*All Service Tags
  strServName(tblservicetag)*/
  db.query("SELECT strServName FROM tblservicetag", function (err, results, fields) {
      if (err) return res.send(err);
      req.servTags = results;
      return next();
  });
}
function searchServTag(req, res, next){
  /*Selected ServiceTag, Match
  *(tblservicetag)*/
  db.query("SELECT * FROM tblservicetag WHERE strServName= ?",[req.params.servName], (err, results, fields) => {
      if (err) return res.send(err);
      req.searchServTag = results;
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
      res.render('services/views/index', {thisUserTab: req.user, servTags: req.servTags});
      break;
  }
}
function servRender(req,res){
  switch (req.valid) {
    case 1:
      res.render('welcome/views/invalid/adm-restrict');
      break;
    case 2:
    case 3:
      if(!req.searchServTag[0]){
        res.render('services/views/notag', {thisUserTab: req.user, servName: req.params.servName});
      }
      else{
        var stringquery="SELECT * FROM tblservice INNER JOIN tblservicetag ON intServTag= intServTagID INNER JOIN tbluser ON intServAccNo= intAccNo WHERE strServName= ? ";
        var paramsarray= [];
        if(req.params.city!='any'){
          stringquery = stringquery.concat("AND strCity= ? ");
          paramsarray.push(req.params.city);
        }
        if(req.params.brngy!='any'){
          stringquery = stringquery.concat("AND strBarangay= ? ");
          paramsarray.push(req.params.brngy);
        }
        if(req.params.pricing=='rate'){
          stringquery = stringquery.concat("AND fltPrice IS NOT NULL ");
        }
        if(req.params.pricing=='notS'){
          stringquery = stringquery.concat("AND fltPrice IS NULL ");
        }/*
        if(req.params.sorting=='rating'){
          stringquery = stringquery.concat("ORDER BY  DESC ");
        }
        if(req.params.sorting=='finished'){
          stringquery = stringquery.concat("ORDER BY  DESC ");
        }*/
        if(paramsarray.length==1){
          db.query(stringquery,[req.params.servName,paramsarray[0]], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, servName: req.params.servName});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                }
                res.render('services/views/result', {thisUserTab: req.user, servName: req.params.servName, searchServ: results});
              }
          });
        }
        else if(paramsarray.length==2){
          db.query(stringquery,[req.params.servName,paramsarray[0],paramsarray[1]], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, servName: req.params.servName});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                }
                res.render('services/views/result', {thisUserTab: req.user, servName: req.params.servName, searchServ: results});
              }
          });
        }
        else{
          db.query(stringquery,[req.params.servName], function (err, results, fields) {
              if (err) return res.send(err);
              if(!results[0])
                res.render('services/views/noresult', {thisUserTab: req.user, servName: req.params.servName});
              else{
                for(count=0;count<results.length;count++){
                  results[count].prepend = prepend(results[count].intServAccNo);
                }
                res.render('services/views/result', {thisUserTab: req.user, servName: req.params.servName, searchServ: results});
              }
          });
        }
      }
      break;
  }
}

router.get('/', flog, servTags, render);
router.get('/:servName/:city/:brngy/:pricing/:sorting', flog, searchServTag, servRender);

router.post('/', flog, (req, res) => {
  if(!req.body.city)
    req.body.city= 'any';
  if(!req.body.brngy)
    req.body.brngy= 'any';
  res.redirect('/services/'+ req.body.searchtag +'/'+ req.body.city +'/'+ req.body.brngy +'/'+ req.body.pricing +'/'+ req.body.sorting);
});

exports.services = router;
