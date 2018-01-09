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
  db.query("SELECT * FROM tblservicetag WHERE strServName= ?",[req.body.searchtag], (err, results, fields) => {
      if (err) return res.send(err);
      req.searchServTag = results;
      return next();
  });
}
function searchServAcc(req, res, next){
  db.query("SELECT * FROM tblservicetag INNER JOIN tblservice ON intServTagID= intServTag WHERE strServName= ? AND intServAccNo= ?",[req.body.searchtag, req.session.user], (err, results, fields) => {
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

router.post('/', myServices, searchServTag, searchServAcc, (req, res) => {
  if(!req.searchServTag[0]){
    res.render('myservices/views/notag', {servTag: req.body.searchtag, myServices: req.myServices});
  }
  else{
    if(!req.searchServAcc[0]){
      var stringquery1="INSERT INTO tblservice (intServTag, intServAccNo, intServStatus, intPriceType) VALUES (?,?,'1',?)" ;
      var stringquery2="INSERT INTO tblservice (intServTag, intServAccNo, intServStatus, fltPrice, intPriceType) VALUES (?,?,'1',?,?)" ;
      var paramsarray= [];
      if(req.body.pricetype=='0'){
        paramsarray.push(req.body.pricetype);
      }
      else{
        paramsarray.push(req.body.price);
        paramsarray.push(req.body.pricetype);
      }
      if(paramsarray.length==1){
        db.query(stringquery1,[req.searchServTag[0].intServTagID, req.session.user, paramsarray[0]], (err, results, fields) => {
            if (err) return res.send(err);
            res.render('myservices/views/success', {servTag: req.searchServTag[0].strServName, myServices: req.myServices});
          });
      }
      else{
        db.query(stringquery2,[req.searchServTag[0].intServTagID, req.session.user, paramsarray[0], paramsarray[1]], (err, results, fields) => {
            if (err) return res.send(err);
            res.render('myservices/views/success', {servTag: req.searchServTag[0].strServName, myServices: req.myServices});
        });
      }

    }
    else{
      res.render('myservices/views/alreadyadded', {servTag: req.searchServTag[0].strServName, myServices: req.myServices});
    }
  }
});

exports.myservices = router;
