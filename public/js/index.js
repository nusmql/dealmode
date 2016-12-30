
$(document).ready(function() {
  console.log("document is ready.");
  // window.enquiry = JSON.parse(enquiry);
});

var socket = io('/index');


$(document).on('submit', '#chating', function(event) {
  event.preventDefault();

  var sender_id = $("#sender_id").val(),
      msg = "[From UserId " + sender_id + "]: " + $('#m').val(),
      enquiry_id = $("#enquiry_id").val(),
      offer_id =  $("#offer_id").val();

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
});


$(document).on('click', '.offer-user', function(event) {
  event.preventDefault();
  var $this = $(this),
      offer = $this.data('offer');

  window.key = offer.enquiry_id + '-' + offer.id;

  // set backgroud color
  $('.offer-user').each(function(index, offerDiv) {
      // console.log(offerDiv);
      $(offerDiv).css('background-color', 'white');
  });
  $this.css('background-color', '#D3D3D3');

  // request to render chatroom
  socket.emit('offer', {
    offer: offer,
    action: 'RENDER_CHATROOM'
  });
})

$(".enquiry").on('click', function(event){
  event.stopPropagation();
  var $this = $(this),
      enquiryId = $this.data('enquiryId');

  // set backgroud color
  $('.enquiry').each(function(index, offerDiv) {
      $(offerDiv).css('background-color', 'white');
  });
  $this.css('background-color', '#D3D3D3');

  // hide chatroom
  $('.chatroom').hide();

  socket.emit('enquiry', {
    "user_token": window.user_token,
    "enquiry_id": enquiryId
  });
});


socket.on('chat message', function(data) {
    // console.log(data);
    // console.log(data.key);
    // console.log(window.key);
    if(window.key === data.key && window.senderId !== data.sender_id) {
      $('#messages').append($('<li>').text(data.msg));
    }
});

socket.on('render offer', function(renderData) {
  if(renderData.user_token === window.user_token) {
    $('.offer').remove();
    $('.offers').append(renderData.html);
  }
});

socket.on('render chatroom', function(data) {

  // console.log(data);
  if(data.user_token === window.user_token && data.key === window.key) {
    console.log("render pass!");
    $('.chatroom').empty();
    $('.chatroom').append(data.html);
    $('.chatroom').show();
  }
});
