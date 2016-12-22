
$(document).ready(function() {
  console.log("document is ready.");
});

var socket = io();
console.log(socket);

$("form").submit(function(event) {
  event.preventDefault();
  var msg = $('#m').val();
  socket.emit('chat message', msg);
  $('#m').val('');

  // append sender message
  $('#messages').append($('<li>').text(msg));
  return false;
})


$(".offer-user").on('click', function(event) {
  event.preventDefault();
  var userId = $(this).data('userId');
  $("#receiver_id").val(userId);
  $("#messages").empty();
})
