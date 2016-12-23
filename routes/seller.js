module.exports = function(io) {
  var express = require('express');
  var router = express.Router();
  var fs = require('fs');
  var url = require('url');

  var Promise = require('bluebird');
  Promise.promisifyAll(fs);

  io.on("connection", function(socket) {
    console.log("a user connected!!!!");
    io.sockets.emit('online', {})

    socket.on('chat message', function(msg) {
      console.log('message', msg);
    })

    socket.on('disconnect', function() {
      console.log("user disconnect");
    })
  });

  /* GET home page. */
  router.get('/', function(req, res, next) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    // default user_id = 2
    var user_id = ("id" in query)? query.id : 2;

    Promise.resolve(fs.readFileAsync('./public/data/seller.json', 'utf8'))
      .then(JSON.parse)
      .then(function(result) {
        var offer = result.offers.filter(function(offer) {
          return offer.user_id === user_id;
        });
        // console.log(offer);
        res.render('seller', Object.assign({}, {title: "Deal Mode"}, {offer: offer}));
      });
  });

  return router;
}
