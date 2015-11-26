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
    .post(function(req, res){
      // var data = req.body.data
      //console.log(req.body['input[]'])
      brainTrain.trainedNetwork(req.body['input[]'], function(data) {
        console.log('CB success! Data sent: ', data);
        res.send(data);
      });


      //console.log(req)

      // We should respond with the result of the call to
      // trainedNetwork (assuming the result is the array of 10)
   });
};