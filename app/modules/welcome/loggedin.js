module.exports= (req,res,next)=>{
  var db = require('../../lib/database')();
  db.query("SELECT * FROM tbluser WHERE intAccNo= ?",[req.session.user], function (err, results, fields) {
      if (err) console.log(err);
      if (!results[0])
        res.redirect('/login/blank');
      else if (results[0].boolIsBanned == 1)
        res.redirect('/login/banned');
      else if (results[0].intType == 1)
        req.valid = 1;
      else if (results[0].intType == 2)
        req.valid = 2;
      else if (results[0].intType == 3)
        req.valid = 3;
      else
        res.render('welcome/views/invalid/error');
      req.user = results;
      return next();
  });

}
