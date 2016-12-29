// buyer router
module.exports = (io) => {

  var express = require('express');
  var router = express.Router();
  var fs = require('fs');
  var pug = require('pug');
  var Promise = require('bluebird');
  Promise.promisifyAll(fs);
  var crypto = require('crypto');
  var user_id = '1';

  var d;
  const offerPugTemplate = pug.compileFile('./views/offer.pug');

  // simulate the user login cookie token
  var user_token = crypto.createHash('md5').update('bbp' + user_id).digest('hex');


  io.on("connection", function(socket) {
    console.log("a buyer connected!!!!");

    socket.on('chat message', function(data) {
      //  console.log('message', data);
      io.emit('chat message', data);
    });

    socket.on('enquiry', function(data) {
      var enquiryId = data.enquiry_id,
          userToken = data.user_token,
          enquiries = d.enquiries || [],
          enquiry = {};

      enquiry = enquiries.filter(function(e) {
        return e.id == enquiryId;
      })[0];

      var renderOffer = '';

      if(enquiry.offers !== 'undefined') {
        enquiry.offers.forEach(function(offer) {
          renderOffer += offerPugTemplate({offer: offer});
        })
      }

      socket.emit('render offer', {html: renderOffer, user_token: user_token});

    });

    socket.on('offer', function(data) {
      if(data.action === 'RENDER_CHATROOM') {
        // prepare chat data
        // fetch chat history data
        // render pug template
        if(data.offer !== 'undefined') {
          var offer = data.offer;
          var chat = {
            'msg': '',
            'sender_id': user_id,
            'receiver_id': offer.user_id,
            'enquiry_id': offer.enquiry_id,
            'offer_id': offer.id,
            'key': offer.enquiry_id + '-' + offer.id // need generate with md5 like token
          };

          var chatroomHtml = pug.renderFile('./views/chat.pug', {
            offer: offer,
            chat: chat
          });

          socket.emit('render chatroom', {
            html: chatroomHtml,
            key: chat.key,
            user_token: user_token
          });

        }
      }
    })

    socket.on('disconnect', function() {
      console.log("buyer disconnect");
    })
  });

  /* GET home page. */
  router.get('/', function(req, res, next) {
    Promise.resolve(fs.readFileAsync('./public/data/buyer.json', 'utf8'))
    .then(JSON.parse)
    .then(function(result) {

      // assign to globle vairable
      d = result;

      res.render('index', Object.assign({}, {title: "Deal Mode", user_token: user_token, user_id: user_id}, {enquiries: result.enquiries}));
    });
  });
  return router;
};
