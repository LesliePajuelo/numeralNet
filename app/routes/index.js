'use strict';

var brainTrain = require(process.cwd() + '/app/controllers/brainTrain.js');
var brainTrain = require(process.cwd() + '/app/controllers/trainedNetwork.js');

module.exports = function (app) {

  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/public/index.html');
    });

  app.route('/trainedNetwork')
    .post(function(req, res) {
      brainTrain.trainedNetwork(req.body['input[]'], function(data) {
        console.log('CB success! Data sent: ', data);
        res.send(data);
      });
    });

};