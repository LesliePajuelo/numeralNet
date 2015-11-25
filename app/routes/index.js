'use strict';

var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');
var brainTrain = require(process.cwd() + '/app/controllers/brainTrain.js');

module.exports = function (app, db) {
   // var clickHandler = new ClickHandler(db);

   app.route('/')
      .get(function (req, res) {
         res.sendFile(process.cwd() + '/public/index.html');
      });

   app.route('/trainedNetwork')
   .post(brainTrain.trainedNetwork);
      
 }