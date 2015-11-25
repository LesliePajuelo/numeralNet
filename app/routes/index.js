'use strict';

var ClickHandler = require(process.cwd() + '/app/controllers/clickHandler.server.js');
var brainTrain = require(process.cwd() + '/app/controllers/brainTrain.js');

module.exports = function (app) {
   // var clickHandler = new ClickHandler(db);

   app.route('/')
      .get(function (req, res) {
         res.sendFile(process.cwd() + '/public/index.html');
      });

   app.route('/trainedNetwork')
   .get(function(req, res){
    // var data = req.body.data
     brainTrain.trainedNetwork(req.query.input);
     // console.log()
   });
 }