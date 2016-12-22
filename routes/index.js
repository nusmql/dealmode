module.exports = function(io) {
  var express = require('express');
  var router = express.Router();
  var fs = require('fs');

  var Promise = require('bluebird');
  Promise.promisifyAll(fs);

  io.on("connection", function(socket) {
    console.log("a user connected!!!!");

    socket.on('chat message', function(msg) {
      console.log('message', msg);
    })

    socket.on('disconnect', function() {
      console.log("user disconnect");
    })
  })


  /* GET home page. */
  router.get('/', function(req, res, next) {
    Promise.resolve(fs.readFileAsync('../dealmode_data.json', 'utf8'))
    .then(JSON.parse)
    .then(function(result) {
      // console.log(result.enquiries[0]);
      var enquiry = result.enquiries[0];
      res.render('index', Object.assign({}, {title: "Deal Mode"}, {enquiry: enquiry}));
    });
  });

  return router;
}


