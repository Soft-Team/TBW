module.exports= (req,res,next)=>{
  var db = require('../../lib/database')();
  db.beginTransaction(function(err) {
    if (err) console.log(err);
    db.query("SELECT * FROM tbluser LEFT JOIN tblworker ON intAccNo= intWorkBusID WHERE intAccNo= ? LIMIT 1",[req.session.user], function (err, results, fields) {
      if (err) console.log(err);
      if (!results[0])
        res.redirect('/login/blank');
      else if (results[0].boolIsBanned == 1)
        res.redirect('/login/banned');
      else if (results[0].intType == 1)
        req.valid = 1;
      else if (results[0].intType == 2)
        req.valid = 2;
      else if (!results[0].intWorkerID)
        req.valid = 0;
      else if (results[0].intType == 3)
        req.valid = 3;
      else
        res.render('welcome/views/invalid/error');
      if(!(!results[0]))
        results[0].formatcontact = results[0].strContactNo.slice(1);
      req.user = results;
      db.commit(function(err) {
        if (err) console.log(err);
        console.log(req.valid)
        return next();
      });
    });
  });

}
