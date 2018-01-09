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
  db.query("SELECT * FROM tblservicetag WHERE strServName= ?",[req.params.servName], (err, results, fields) => {
      if (err) return res.send(err);
      req.searchServTag = results;
      return next();
  });
}
function searchServAcc(req, res, next){
  db.query("SELECT * FROM tblservicetag INNER JOIN tblservice ON intServTagID= intServTag WHERE strServName= ? AND intServAccNo= ?",[req.params.servName, req.session.user], (err, results, fields) => {
      if (err) return res.send(err);
      req.searchServAcc = results;
      return next();
  });
}
function myServices(req, res, next){
  db.query("SELECT * FROM tbluser INNER JOIN tblservice ON intAccNo= intServAccNo INNER JOIN tblservicetag ON intServTag= intServTagID WHERE intAccNo= ?",[req.session.user], (err, results, fields) => {
      if (err) return res.send(err);
      req.myServices = results;
      return next();
  });
}

function render(req,res){
  req.session.user= '1';
  console.log(req.session.user);
  res.render('myservices/views/index', {myServices: req.myServices});
}

router.get('/', myServices, render);

router.post('/', (req, res) => {
  console.log(req.body.searchtag);
  res.redirect('/myservices');
  /*res.redirect('/myservices/'+ req.body.searchtag);*/
});

exports.myservices = router;
