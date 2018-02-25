module.exports= (req,res,next)=>{
  var db = require('../../lib/database')();
  /*COunt of Unseen Messages, Match(session)
  *(tblmessage)*(tblchat)*(tblservice)*/
  db.query("SELECT COUNT(intMessSeen) AS count FROM tblmessage INNER JOIN tblchat ON intChatID= intMessChatID INNER JOIN tblservice ON intChatServ= intServID WHERE intMessSeen= 0 AND (intServAccNo= ? OR intChatSeeker = ?)",[req.session.user, req.session.user], function (err, results, fields) {
      if (err) return res.send(err);
      req.messCount = results;
      return next();
  });
}
