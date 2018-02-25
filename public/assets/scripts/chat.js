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
    var dte = new Date();

    d = [dte.getMonth()+1,
         dte.getDate(),
         dte.getFullYear()].join('/')+' '+
         formatAMPM(dte);
    if (data.message.length > 8){
      data.messdisplay = data.message.substring(0,8).concat('...');
    }
    else{
      data.messdisplay = data.message;
    }
    output.innerHTML += '<div class="msg"><div class="media-body"><small class="pull-right time"><i class="fa fa-clock-o"></i>&nbsp' + d + '</small><h5 class="media-heading">' + data.handle + '</h5><small class="col-sm-11">' + data.message + '</small></div></div>';
    mess.innerHTML = '<span>' + data.messdisplay + '</span>';
    time.innerHTML = '<small class="pull-right time">' + d + '</small>';

    function formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
});

// post
