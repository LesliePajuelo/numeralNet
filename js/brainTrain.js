var brain = require('brain');
var fs = require('fs');


var testDataArray = [];

fs.readFile(__dirname + '/../assets/mnist_test.csv', function(err, data){
  if(err) {
    throw err;
  } else {
    var csvData = data.toString().split("\n");
    for(var i = 0; i < csvData.length; i++) {
        
      testDataArray.push(csvData[i].split(','));
      //console.log(csvData[i].length);
      
    }
  testData(testDataArray[0]);
  //console.log(testDataArray[0]);
  }
});

var testData = function(data) {
  var label = parseInt(data.shift());
  console.log(typeof label)
  var decimalizedData = data.map(function(num){ return parseFloat((parseInt(num)/255).toFixed(2)) } );
  // console.log(label, decimalizedData)
}


// var trainingData = fs.readFile(__dirname + '/../assets/mnist_train.csv', function(err, data){
//     if(err) {
//         throw err;
//     } else{
//         return data
//     }
// });


// It would be nice with a checker instead of a hard coded 60000 limit here
// for (var image = 0; image <= 0; image++) { 
//     var pixels = [];

//     for (var x = 0; x <= 27; x++) {
//         for (var y = 0; y <= 27; y++) {
//             // console.log(testData[(image * 28 * 28) + (x + (y * 28)) + 15]);
//             pixels.push(testData[(image * 28 * 28) + (x + (y * 28)) + 15]);
//         }
//     }

//     var imageData  = {};
//     imageData[JSON.stringify(trainingData[image + 9])] = pixels;
//     for (var p = 0; p < 100; p++) {
//     console.log(parseInt(trainingData[image + p]));
//     }
//     // console.log(imageData);
//     pixelValues.push(imageData);
// }
// // console.log(pixelValues[0]);







// var net = new brain.NeuralNetwork();

// net.train([
//            {input: [0, 0], output: [0]},
//            {input: [0, 1], output: [1]},
//            {input: [1, 0], output: [1]},
//            {input: [1, 1], output: [0]},
//            {input: [1, 0], output: [1]}
// ])

// var output = net.run([1,1])

// //console.log(output)
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


