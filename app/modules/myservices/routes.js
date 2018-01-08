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

function render(req,res){
  console.log(req.session.user);
  res.render('myservices/views/index');
}

router.get('/', render);

router.post('/', (req, res) => {
  res.redirect('/services/'+ req.body.searchtag);
});

exports.myservices = router;
