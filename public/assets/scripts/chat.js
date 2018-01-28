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
    output.innerHTML += '<p><strong>' + data.handle + ' : </strong>' + data.message + '</p>';
});

// post
