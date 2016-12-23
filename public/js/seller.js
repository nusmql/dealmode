
$(document).ready(function() {
  console.log("document is ready.");
});

var socket = io();

console.log(socket);

$("form").submit(function(event) {
  event.preventDefault();
  var sender_id = $("#sender_id").val(),
      msg = "[From UserId " + sender_id + "]: " + $('#m').val(),
      enquiry_id = $("#enquiry_id").val(),
      offer_id = $("#offer_id").val();

  socket.emit('chat message', {
    "msg": msg,
    "sender_id": sender_id,
    "receiver_id": $("#receiver_id").val(),
    "enquiry_id": enquiry_id,
    "offer_id": offer_id,
    "key": enquiry_id + '-' + offer_id
  });


  $('#m').val('');

  // append sender message
  $('#messages').append($('<li>').text(msg));
  return false;
})

socket.on('chat message', function(data) {
    console.log(data);
    console.log(data.key);
    console.log(window.key);
    if(window.key === data.key && window.senderId !== data.sender_id) {
      $('#messages').append($('<li>').text(data.msg));
    }
});
