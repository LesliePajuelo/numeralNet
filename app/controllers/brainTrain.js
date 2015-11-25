var brain = require('brain');
var fs = require('fs');

var trainedBrainData;
var testDataArray = [];

fs.readFile(process.cwd() + '/assets/mnist_train.csv', function(err, data){
  if(err) {
    throw err;
  } else {
    var csvData = data.toString().split("\n");
    for(var i = 0; i < 59999; i++) {
        
      testDataArray.push(csvData[i].split(','));

      
    }
  trainBrain(testDataArray);

  }
});


var net = new brain.NeuralNetwork();
var trainBrain = function(data) {

    var labels;
    var pictures;
    var testTrainingData = [];
    data.forEach(function(arr) {
      //setting lables as index flags in output y
      var output = Array.apply(null, Array(10)).map(Number.prototype.valueOf, 0); 
      labels = parseInt(arr.shift())
      output[labels] = 1;

      pictures = arr.map(function(num){ return parseInt(num) } );
      testTrainingData.push( { input: pictures, output: output } );
    });
    net.train(testTrainingData);
    
    json = JSON.stringify(net.toJSON());
    fs.writeFile(process.cwd() + '/assets/trainedBrainData.json', json, function(err){
      if(err) throw err;
      console.log('written');
    } );

    console.log('training');
}

var trainedNetwork = function(data) {
  console.log('Comparing data on trained brain')
  console.log(net.run(data));
};

exports.trainedNetwork = trainedNetwork;
