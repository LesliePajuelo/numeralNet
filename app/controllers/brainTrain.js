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

      pictures = arr.map(function(num){ return parseInt(num) } );
      testTrainingData.push( { input: pictures, output: output } );
    });
    net.train(testTrainingData);
    // console.log(net.train(testTrainingData));
    
    json = net.toJSON();
    console.log('training')
    //console.log(json)
    return json;
  
}

var trainedNetwork = function(data) {
  console.log('trained brain train')
  console.log(net.run(data));
};

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


