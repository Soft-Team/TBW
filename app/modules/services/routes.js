var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

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
  res.render('services/views/index');
}
function servRender(req,res){
  if(!req.searchServTag[0]){
    res.render('services/views/notag', {servName: req.params.servName});
  }
  else{
    var stringquery="SELECT * FROM tblservice INNER JOIN tblservicetag ON intServTag= intServTagID INNER JOIN tbluser ON intServAccNo= intAccNo WHERE strServName= ? ";
    var paramsarray= [];
    if(req.params.city!='any'){
      stringquery = stringquery.concat("AND strCity= ? ");
      paramsarray.push(req.params.city)
    }
    if(req.params.brngy!='any'){
      stringquery = stringquery.concat("AND strBarangay= ? ");
      paramsarray.push(req.params.brngy)
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
            res.render('services/views/noresult', {servName: req.params.servName});
          else
            res.render('services/views/result', {servName: req.params.servName, searchServ: results});
      });
    }
    else if(paramsarray.length==2){
      db.query(stringquery,[req.params.servName,paramsarray[0],paramsarray[1]], function (err, results, fields) {
          if (err) return res.send(err);
          if(!results[0])
            res.render('services/views/noresult', {servName: req.params.servName});
          else
            res.render('services/views/result', {servName: req.params.servName, searchServ: results});
      });
    }
    else{
      db.query(stringquery,[req.params.servName], function (err, results, fields) {
          if (err) return res.send(err);
          if(!results[0])
            res.render('services/views/noresult', {servName: req.params.servName});
          else
            res.render('services/views/result', {servName: req.params.servName, searchServ: results});
      });
    }
  }
}

router.get('/', render);
router.get('/:servName/:city/:brngy/:pricing/:sorting', searchServTag, servRender);

router.post('/', (req, res) => {
  if(!req.body.city)
    req.body.city= 'any';
  if(!req.body.brngy)
    req.body.brngy= 'any';
  res.redirect('/services/'+ req.body.searchtag +'/'+ req.body.city +'/'+ req.body.brngy +'/'+ req.body.pricing +'/'+ req.body.sorting);
});

exports.services = router;
