//------------------------------------------------------------------------------
// Client-Side Digit Recognition for GitHub Pages
// Handles canvas drawing and neural network processing
//------------------------------------------------------------------------------

// Global variables for canvas and neural network
var canvas;
var context;
var trainedNetwork = null;

//-----------------------------------------------------------------------
// Utility Functions:
//-----------------------------------------------------------------------

var erase = function() {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  clickX = [];
  clickY = [];
  clickDrag = [];
};

function topTwo (data) {
  var index;
  var max;
  var highestProbs = [];

  function currTop(data) {
    index = data.indexOf(Math.max.apply(null, data));
    max = Math.max.apply(null, data);
    data.splice(index, 1, 0);
    return [index, (max*100).toPrecision(3) + '%'];
  };

  highestProbs.push(currTop(data));
  highestProbs.push(currTop(data));
  return highestProbs;
};

function renderResults(data) {
  var highestProbs = topTwo(data);

  var formattedData = '<p>Your number: <span class="digit">'+ highestProbs[0][0] + 
                      '</span> confidence: <span class="percent">' + 
                      highestProbs[0][1] + '</span></p> \n' +
                      '<p>Second possibility: <span class="digit">'+ 
                      highestProbs[1][0] + '</span> confidence: ' + 
                      '<span class="percent">' + highestProbs[1][1] +
                      '</span></p>';

  $('#results').html(formattedData).show;
};

//-----------------------------------------------------------------------
// Capture user input:
//-----------------------------------------------------------------------

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

$('#canvas').mousedown(function(e) {
  console.log('Mouse down event triggered');
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
    
  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
});

$('#canvas').mousemove(function(e) {
  if(paint) {
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});

$('#canvas').mouseup(function(e) {
  paint = false;
});

$('#canvas').mouseleave(function(e) {
  paint = false;
});

var addClick = function(x,y,dragging) {
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
};

var redraw = function() {
  context.clearRect(0,0, canvas.width, canvas.height);
  context.strokeStyle ="#ff0000";
  context.lineJoin = "round";
  context.lineWidth = 13;

  for(var i = 0; i < clickX.length; i++){
    
    if(clickDrag[i] && i){
      context.beginPath();
      context.moveTo(clickX[i-1], clickY[i-1]);
    } else {
      context.moveTo(clickX[i], clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.stroke();
  }
};

//-----------------------------------------------------------------------
// Get numerical representation of canvas content:
//-----------------------------------------------------------------------

var recognize = function() {
  if (!trainedNetwork) {
    $('#results').html('<p>Error: Neural network not loaded. Please wait...</p>');
    return;
  }
  
  console.log('Canvas click data:', clickX.length, 'clicks');
  if (clickX.length === 0) {
    $('#results').html('<p>Please draw a digit first!</p>');
    return;
  }

  var image = context.getImageData(0,0,canvas.width, canvas.height);
  var shadowCanvas = document.createElement('canvas');
  var shadowContext = shadowCanvas.getContext('2d', { willReadFrequently: true });
  shadowCanvas.width = 28;
  shadowCanvas.height = 28;

  // Clear the shadow canvas first
  shadowContext.fillStyle = 'white';
  shadowContext.fillRect(0, 0, 28, 28);
  
  // Draw the canvas content onto the shadow canvas, properly scaled
  // This creates a 28x28 version of what was drawn
  shadowContext.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 28, 28);
  
  // Get the image data from the 28x28 canvas
  var teeny = shadowContext.getImageData(0, 0, shadowCanvas.width, shadowCanvas.height);
  
  console.log('Canvas dimensions:', shadowCanvas.width, 'x', shadowCanvas.height);
  console.log('Image data length:', teeny.data.length);
  console.log('Expected data length:', shadowCanvas.width * shadowCanvas.height * 4);

  // Convert to grayscale and normalize to 0-1 range (MNIST format)
  // MNIST uses white background (255) and black digits (0), so we invert
  var normalizedValues = [];
  for(var i = 0; i < teeny.data.length; i += 4) {
    // Convert RGB to grayscale: 0.299*R + 0.587*G + 0.114*B
    var gray = 0.299 * teeny.data[i] + 0.587 * teeny.data[i+1] + 0.114 * teeny.data[i+2];
    
    // Invert and normalize: white background becomes 0, black digits become 1
    // This matches MNIST format where digits are white on black background
    var normalized = (255 - gray) / 255;
    normalizedValues.push(normalized);
  }

  // Clean up the temporary canvas (it was never added to DOM, so no need to remove)
  shadowCanvas = null;

  // Process with neural network
  try {
    console.log('Input array length:', normalizedValues.length);
    console.log('Expected length: 784 (28x28)');
    if (normalizedValues.length !== 784) {
      throw new Error('Input array length mismatch. Expected 784, got ' + normalizedValues.length);
    }

    // TODO RUPA/LP swap out this function! 
    var networkOutput = trainedNetwork.run(normalizedValues);
    renderResults(networkOutput);
  } catch (error) {
    console.error('Error running neural network:', error);
    $('#results').html('<p>Error: Failed to process image</p>');
  }
};

//-----------------------------------------------------------------------
// Load pre-trained neural network:
//-----------------------------------------------------------------------

function loadTrainedNetwork() {
  console.log('Loading neural network - Version 5');
// TODO RUPA/LP swap out this file. 
  fetch('./test.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load neural network data');
      }
      return response.json();
    })
    .then(data => {
      console.log('Loaded neural network data:', data);
      
      // TODO RUPA/LP swap out this function!

      trainedNetwork = new NeuralNetwork();
      
      trainedNetwork.fromJSON(data);
      
      console.log('Neural network loaded successfully');
      console.log('Input size:', trainedNetwork.inputSize);
      console.log('Output size:', trainedNetwork.outputSize);
      console.log('Hidden layers:', trainedNetwork.hiddenLayers);
      $('#results').html('<p>Neural network ready! Draw a digit and click recognize.</p>');
    })
    .catch(error => {
      console.error('Error loading neural network:', error);
      $('#results').html('<p>Error: Could not load neural network. Please refresh the page.</p>');
    });
}

//-----------------------------------------------------------------------
// Initialize when page loads:
//-----------------------------------------------------------------------

$(document).ready(function() {
  console.log('NumeralNet initialized - Version 5');
  
  // Initialize canvas after DOM is loaded
  canvas = document.getElementById('canvas');
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }
  context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) {
    console.error('Could not get canvas context!');
    return;
  }
  
  console.log('Canvas initialized:', canvas.width, 'x', canvas.height);
  
  loadTrainedNetwork();
  
  $('#canvas').on('mousedown mousemove mouseup mouseleave', function(e) {
    e.preventDefault();
  });
});

