var brain = require('brain');
var fs = require('fs');


var testDataArray = [];

fs.readFile(process.cwd() + '/assets/mnist_test.csv', function(err, data){
  if(err) {
    throw err;
  } else {
    var csvData = data.toString().split("\n");
    for(var i = 0; i < 2; i++) {
        
      testDataArray.push(csvData[i].split(','));
      //console.log(csvData[i].length);
      
    }
  testData(testDataArray);
  }
});



var output = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,84,185,159,151,60,36,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,222,254,254,254,254,241,198,198,198,198,198,198,198,198,170,52,0,0,0,0,0,0,0,0,0,0,0,0,67,114,72,114,163,227,254,225,254,254,254,250,229,254,254,140,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,66,14,67,67,67,59,21,236,254,106,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,83,253,209,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,22,233,255,83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,129,254,238,44,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,59,249,254,62,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,133,254,187,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,9,205,248,58,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,126,254,182,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,75,251,240,57,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,19,221,254,166,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,203,254,219,35,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,38,254,254,77,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,31,224,254,115,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,133,254,254,52,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,61,242,254,254,52,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,121,254,254,219,40,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,121,254,207,18,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
var net = new brain.NeuralNetwork();
var testData = function(data) {

    var labels;
    var pictures;
    var testTrainingData = [];
    data.forEach(function(arr) {
      //setting lables as index flags in output y
      var output = Array.apply(null, Array(10)).map(Number.prototype.valueOf, 0); 
      labels = parseInt(arr.shift())
      output[labels] = 1;


      //converts 0-255 values to truncated decimals
      pictures = arr.map(function(num){ return parseInt(num) } );
      testTrainingData.push( { input: pictures, output: output } );
    });
    net.train(testTrainingData);
    // console.log(net.train(testTrainingData));
    return json = net.toJSON();
  
}

var trainedNetwork = function() {
  console.log('trained  brain train')
  //console.log(net.run(output));
};

//Robby
exports.trainedNetwork = trainedNetwork;
// var net = new brain.NeuralNetwork();

// net.train([
//            {input: [0, 0], output: ['0']},
//            {input: [0, 1], output: ['10']},
//            {input: [1, 0], output: ['10']},
//            {input: [1, 1], output: ['0']},
//            {input: [1, 0], output: ['10']}
// ])

// var output = net.run([1,0])

// console.log(output)
// //---------------------------------------------
// // Teach it math:
// //---------------------------------------------
// var mathNet = new brain.NeuralNetwork();

// mathNet.train([
//            {input: [-0.2, -0.2], output: [-0.4]},
//            {input: [-0.3, -0.3], output: [-0.6]},
//            {input: [-0.4, -0.4], output: [-0.8]},
//            {input: [-0.0, -0.5], output: [-0.5]},
//            {input: [-0.1, -0.6], output: [-0.7]},
//            {input: [-0.5, -0.5], output: [-1]},
//            {input: [-0.1, -0.1], output: [-0.2]},
//            {input: [-0.1, -0.3], output: [-0.4]},
//            {input: [-0.1, -0.7], output: [-0.8]},
//            {input: [-0.1, -0.8], output: [-0.9]}
// ], {
//   errorThresh: 0.00005,  // error threshold to reach
//   iterations: 20000,   // maximum training iterations
//   log: true,           // console.log() progress periodically
//   logPeriod: 10,       // number of iterations between logging
//   learningRate: 0.3    // learning rate
// })

// var mathOutput = mathNet.run([-0.1, -0.8])

// console.log(mathOutput)


