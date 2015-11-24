var brain = require('brain');  
var fs = require('fs');

var getMnistData = function(content) {  
    var lines = content.toString().split('\n');

    var data = [];
    for (var i = 0; i < lines.length; i++) {
        var input = lines[i].split(',').map(Number);

        var output = Array.apply(null, Array(10)).map(Number.prototype.valueOf, 0);
        output[input.shift()] = 1;

        data.push({
            input: input,
            output: output
        });
    }
    console.log(data)
    return data;
};

fs.readFile(__dirname + '/../assets/test.csv', function (err, trainContent) {  
    if (err) {
        console.log('Error:', err);
    }

    var trainData = getMnistData(trainContent);

    console.log('Got ' + trainData.length + ' samples');

    // var net = new brain.NeuralNetwork({hiddenLayers: [784, 392, 196]});

    // net.train(trainData, {
    //     errorThresh: 0.025,
    //     log: true,
    //     logPeriod: 1,
    //     learningRate: 0.1
    // });
});