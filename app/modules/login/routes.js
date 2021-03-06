var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  req.session.user = '';
  res.render('login/views/index');
}
function blankRender(req,res){
  req.session.user = '';
  res.render('login/views/invalid/nouser');
}
function bannedRender(req,res){
  req.session.user = '';
  res.render('login/views/invalid/banned');
}

router.get('/', render);
router.get('/blank', blankRender);
router.get('/banned', bannedRender);

router.post('/', (req, res) => {
  db.query("SELECT * FROM tbluser WHERE strUserName= ?",[req.body.username], (err, results, fields) => {
    if (err) console.log(err);
    if (!results[0])
      res.render('login/views/invalid/incorrect');
    else if (results[0].boolIsBanned == 1)
      res.redirect('/login/banned');
    else if (results[0].intType == 3 && results[0].intStatus == 1)
      res.render('login/views/invalid/unregistered');
    else if(req.body.password === results[0].strPassword){
      req.session.user = results[0].intAccNo;
      if(results[0].intType == 1)
        res.redirect('/admin');
      else
        res.redirect('/home');
    }
    else
      res.render('login/views/invalid/incorrect');
  });
});

exports.login = router;
