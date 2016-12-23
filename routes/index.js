
var express = require('express');
var router = express.Router();
var fs = require('fs');

var Promise = require('bluebird');
Promise.promisifyAll(fs);

/* GET home page. */
router.get('/', function(req, res, next) {
  Promise.resolve(fs.readFileAsync('./public/data/buyer.json', 'utf8'))
  .then(JSON.parse)
  .then(function(result) {
      // console.log(result.enquiries[0]);
      var enquiry = result.enquiries[0];
      var chat = {
        'msg': '',
        'sender_id': enquiry.user_id,
        'receiver_id': enquiry.offers[0].user_id,
        'enquiry_id': enquiry.id,
        'offer_id': enquiry.offers[0].id,
        'key': enquiry.id + '-' + enquiry.offers[0].id
      }
      res.render('index', Object.assign({}, {title: "Deal Mode"}, {enquiry: enquiry, chat: chat}));
    });
});

module.exports = router;
