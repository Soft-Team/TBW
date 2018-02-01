// Make connection
var socket = io.connect('http://localhost:3000');

// Query DOM
var message = document.getElementById('message'),
    handle = document.getElementById('handle'),
    chatid = document.getElementById('chatid'),
    sender = document.getElementById('sender'),
    btn = document.getElementById('send'),
    output = document.getElementById('output');

// Emit events
btn.addEventListener('click', function(){
    socket.emit('chat', {
        message: message.value,
        handle: handle.value,
        chatid: chatid.value,
        sender: sender.value
    });
    message.value = "";
});

// Listen for events
socket.on('chat', function(data){
    var d = new Date();
    output.innerHTML += '<div class="msg"><div class="media-body"><small class="pull-right time"><i class="fa fa-clock-o"> ' + d.getHours()+ ':' +d.getMinutes() + '</i></small><h5 class="media-heading">' + data.handle + '</h5><small class="col-sm-11">' + data.message + '</small></div></div>';
});

// post
