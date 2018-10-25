'use strict';

var brainTrain = require(process.cwd() + '/app/controllers/brainTrain.js');
var network = require(process.cwd() + '/app/controllers/trainedNetwork.js');

module.exports = function (app) {

  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/public/index.html');
    });

  app.route('/trainedNetwork')
    .post(function(req, res) {
      network.trainedNetwork(req.body['input[]'], function(data) {
        console.log('CB success! Data sent: ', data);
        res.send(data);
      });
    });

  app.route('/brainTrain')
    .get(function (req, res) {
      brainTrain.fetchBrainData(function(name) {
        res.send(name)
      });
    });
};