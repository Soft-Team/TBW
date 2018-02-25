require('dotenv').config();
var express = require('express');
var winston = require('winston');
var socket = require('socket.io');
var app = express();
require('./app')(app);

var server = app.listen(app.get('port'), () => {
    console.log(`ExpressJS server listening to port ${app.get('port')}`);
});

var io = socket(server);
io.on('connection', (socket) => {

    console.log('made socket connection', socket.id);
    // Handle chat event
    socket.on('chat', function(data){
        console.log(data);
        io.emit('chat', data);
        var db = require('./app/lib/database')();
        db.beginTransaction(function(err) {
          if (err) console.log(err);
          db.query("SELECT A.* , (tbluser.strName)Seeker, (tbluser.intAccNo)SAccNo FROM (SELECT * FROM tblchat INNER JOIN tblmessage ON intChatID= intMessChatID INNER JOIN tblservice ON intChatServ= intServID INNER JOIN tbluser ON intAccNo= intServAccNo INNER JOIN tblservicetag ON intServTagID= intServTag)AS A INNER JOIN tbluser ON tbluser.intAccNo= A.intChatSeeker WHERE A.intChatID= ?",[data.chatid], (err, results, fields) => {
              if (err) console.log(err);
              if(!(!results[0])){
                for(count=0;count<results.length;count++){
                  if(data.user == results[count].intAccNo){
                    results[count].sendType = 1;
                  }
                  else if(data.user == results[count].SAccNo){
                    results[count].sendType = 2;
                  }
                  else{
                    results[count].sendType = 0;
                  }
                }
              }
              var stringquery = "INSERT INTO tblmessage ( intMessChatID, txtMessage, dtmDateSent, intMessSSeen, intSender ) VALUES ( ?, ?, NOW(), 1, ?)";
              if(results[0].sendType == 1){
                stringquery = "INSERT INTO tblmessage ( intMessChatID, txtMessage, dtmDateSent, intMessPSeen, intSender ) VALUES ( ?, ?, NOW(), 1, ?)";
              }
              db.query(stringquery,[data.chatid, data.message, data.sender], (err, results, fields) => {
                  if (err) console.log(err);
                  db.commit(function(err) {
                      if (err) console.log(err);
                  });
              });
          });
        });
    });
});
