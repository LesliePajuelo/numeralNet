//------------------------------------------------------------------------------
// Uncomment to train a new brain:
//------------------------------------------------------------------------------

// var brain = require('brain');
// var fs = require('fs');

// var trainedBrainData;
// var testDataArray = [];
// var startTime = new Date();

// fs.readFile(process.cwd() + '/assets/mnist_train.csv', function(err, data) {
//   if(err) {
//     throw err;
//   } else {
//     var csvData = data.toString().split("\n");
//     for(var i = 0; i < 59999; i++) {
//       testDataArray.push(csvData[i].split(','));
//     }
//     trainBrain(testDataArray);
//     var endTime = new Date() - startTime;
//     console.log('Training took ' + endTime / 1000 +'s');
//   }
// });

// var net = new brain.NeuralNetwork({hiddenLayers: [784, 392, 196]});

// var trainBrain = function(data) {
//   var labels;
//   var pictures;
//   var testTrainingData = [];
//   data.forEach(function(arr) {
//     // Use position of 1 in output as label equivalent:
//     var output = Array.apply(null, Array(10)).map(Number.prototype.valueOf, 0); 
//     labels = parseInt(arr.shift());
//     output[labels] = 1;

//     pictures = arr.map(function(num){ return parseInt(num) } );
//     testTrainingData.push( { input: pictures, output: output } );
//   });

//   net.train(testTrainingData, {
//     log: true,
//     logPeriod: 1,
//     errorThresh: 0.025,
//     learningRate: 0.025,
//     iterations: 20
//   });

//   json = JSON.stringify(net.toJSON());
//   fs.writeFile(process.cwd() + '/assets/testBrainData.json', json, function(err){
//     if(err) {
//       throw err;
//     }
//   });
//   console.log('training...');
// };
