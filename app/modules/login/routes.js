var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  res.render('login/views/index');
}

router.get('/', render);

router.post('/', (req, res) => {
  res.redirect('/home');
});

exports.login = router;
