var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  req.session.user = '';
  req.session.username = '';
  res.render('login/views/index');
}

router.get('/', render);

router.post('/', (req, res) => {
  db.query("SELECT * FROM tbluser WHERE strUserName= ?",[req.body.username], (err, results, fields) => {
    if (err) console.log(err);
    if (!results[0])
      res.render('login/views/invalid/incorrect');
    else if (results[0].intStatus == '2')
      res.render('login/views/invalid/banned');
    else if(req.body.password === results[0].strPassword){
      req.session.user = results[0].intAccNo;
      req.session.username = results[0].strUserName;
      if(results[0].intType == '1')
        res.redirect('/admin');
      else
        res.redirect('/home');
    }
    else
      res.render('login/views/invalid/incorrect');
  });
});

exports.login = router;
