var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();

function render(req,res){
  res.render('register/views/index');
}

router.get('/', render);

router.post('/', (req, res) => {
  res.redirect('/login');
});

exports.register = router;
