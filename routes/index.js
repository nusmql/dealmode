var express = require('express');
var router = express.Router();
var fs = require('fs');

var Promise = require('bluebird');
Promise.promisifyAll(fs);


/* GET home page. */
router.get('/', function(req, res, next) {
  Promise.resolve(fs.readFileAsync('../dealmode_data.json', 'utf8'))
    .then(function(result) {
      res.render('index', Object.assign({}, {title: "Deal Mode"}, result));
    });
});

module.exports = router;
