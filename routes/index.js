// buyer router
module.exports = (io) => {

  var express = require('express');
  var router = express.Router();
  var fs = require('fs');
  var pug = require('pug');
  var Promise = require('bluebird');
  Promise.promisifyAll(fs);
  var crypto = require('crypto');

  var d;
  const offerPugTemplate = pug.compileFile('./views/offer.pug');

  var user_token = crypto.createHash('md5').update('bbp' + '1').digest('hex');


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
      // console.log(result.enquiries[0]);
      // var enquiry = result.enquiries[0];
      // var chat = {
      //   'msg': '',
      //   'sender_id': enquiry.user_id,
      //   'receiver_id': enquiry.offers[0].user_id,
      //   'enquiry_id': enquiry.id,
      //   'offer_id': enquiry.offers[0].id,
      //   'key': enquiry.id + '-' + enquiry.offers[0].id
      // }

      d = result;

      res.render('index', Object.assign({}, {title: "Deal Mode", user_token: user_token}, {enquiries: result.enquiries}));
    });
  });
  return router;
};
