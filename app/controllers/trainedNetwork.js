var brain = require('brain');
var currentBrain = require(process.cwd() + '/assets/fourthBrainData.json');
var net = new brain.NeuralNetwork();

var trainedNetwork = function (data, cb) {
  net.fromJSON(currentBrain);

  var results = net.run(data);
  if (results) {
    cb(results);
  } else {
    console.error('No results from trained Network!');
  }

};

exports.trainedNetwork = trainedNetwork;
