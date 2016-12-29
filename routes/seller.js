module.exports = function(io) {
  var express = require('express');
  var router = express.Router();
  var fs = require('fs');
  var url = require('url');
  var crypto = require('crypto');

  var Promise = require('bluebird');
  Promise.promisifyAll(fs);
  var user_token;

  // // handle socket.io event
  // io.on("connection", function(socket) {
  //   console.log("a seller connected!!!!");

  //   socket.on('chat message', function(data) {
  //   // console.log('message', data);
  //   io.emit('chat message', data);
  // })

  //   socket.on('disconnect', function() {
  //     console.log("seller disconnect");
  //   })
  // })


  /* GET home page. */
  router.get('/', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    // default user_id = 2
    var user_id = ("id" in query)? query.id : 2;

    user_token = crypto.createHash('md5').update('bbp' + user_id).digest('hex')

    Promise.resolve(fs.readFileAsync('./public/data/seller.json', 'utf8'))
    .then(JSON.parse)
    .then(function(result) {
      var offers = result.offers.filter(function(offer) {
        return offer.user_id === user_id;
      });
      var offer = offers[0];

      var chat = {
        'msg': '',
        'sender_id': offer.user_id,
        'receiver_id': offer.enquiry.user_id,
        'enquiry_id': offer.enquiry.id,
        'offer_id': offer.id,
        'key': offer.enquiry.id + '-' + offer.id
      }
        // console.log(offer);
        res.render('seller', Object.assign({}, {title: "Deal Mode", user_token: user_token, user_id: user_id}, {offer: offer, chat: chat}));
      });
  });

  return router;
}
