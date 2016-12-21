var fetchData = require('./data');

var printData = function(err, data) {
  if (err) {
    console.error(err);
  }

  console.log(data);
}

fetchData('./dealmode_data.json', printData);


