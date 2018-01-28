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
        io.sockets.emit('chat', data);
        var db = require('./app/lib/database')();
        db.query("INSERT INTO tblmessage ( message_chatid, message_sender, message_text ) VALUES ( 1, 1, ? )",[data.message], (err, results, fields) => {
            if (err) console.log(err);
          });
    });

});
