var canvas;
var context;

var prevX = 0;
var currX = 0;
var prevY = 0;
var currY = 0;
var paths = [];
var paintFlag = false;
var color = "black";
var lineWidth = 20;

var clearBeforeDraw = false;

    
function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");

    canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}


// computes center of mass of digit, for centering
// note 1 stands for black (0 white) so we have to invert.
function centerImage(img) {
  var meanX = 0;
  var meanY = 0;
  var rows = img.length;
  var columns = img[0].length;
  var sumPixels = 0;
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < columns; x++) {
      var pixel = (1 - img[y][x]);
      sumPixels += pixel;
      meanY += y * pixel;
      meanX += x * pixel;
    }
  }
  meanX /= sumPixels;
  meanY /= sumPixels;

  var dY = Math.round(rows/2 - meanY);
  var dX = Math.round(columns/2 - meanX);
  return {transX: dX, transY: dY};
}

// given grayscale image, find bounding rectangle of digit defined
// by above-threshold surrounding
function getBoundingRectangle(img, threshold) {
  var rows = img.length;
  var columns = img[0].length;
  var minX=columns;
  var minY=rows;
  var maxX=-1;
  var maxY=-1;
  for (var y = 0; y < rows; y++) {
    for (var x = 0; x < columns; x++) {
      if (img[y][x] < threshold) {
        if (minX > x) minX = x;
        if (maxX < x) maxX = x;
        if (minY > y) minY = y;
        if (maxY < y) maxY = y;
      }
    }
  }
  return { minY: minY, minX: minX, maxY: maxY, maxX: maxX};
}

// take canvas image and convert to grayscale. Mainly because my
// own functions operate easier on grayscale, but some stuff like
// resizing and translating is better done with the canvas functions
function imageDataToGrayscale(imgData) {
  var grayscaleImg = [];
  for (var y = 0; y < imgData.height; y++) {
    grayscaleImg[y]=[];
    for (var x = 0; x < imgData.width; x++) {
      var offset = y * 4 * imgData.width + 4 * x;
      var alpha = imgData.data[offset+3];
      // weird: when painting with stroke, alpha == 0 means white;
      // alpha > 0 is a grayscale value; in that case I simply take the R value
      if (alpha == 0) {
        imgData.data[offset] = 255;
        imgData.data[offset+1] = 255;
        imgData.data[offset+2] = 255;
      }
      imgData.data[offset+3] = 255;
      // simply take red channel value. Not correct, but works for
      // black or white images.
      grayscaleImg[y][x] = Math.abs(255-imgData.data[y*4*imgData.width + x*4 + 0]) / 255;
    }
  }
  return grayscaleImg;
}
// takes the image in the canvas, centers & resizes it, then puts into 10x10 px bins
// to give a 28x28 grayscale image; then, computes class probability via neural network
function recognize() {
  var t1 = new Date();

  // convert RGBA image to a grayscale array, then compute bounding rectangle and center of mass
  var imgData = context.getImageData(0, 0, 280, 280);
  grayscaleImg = imageDataToGrayscale(imgData);
  var boundingRectangle = getBoundingRectangle(grayscaleImg, 0.01);
  var trans = centerImage(grayscaleImg); // [dX, dY] to center of mass

  // copy image to hidden canvas, translate to center-of-mass, then
  // scale to fit into a 200x200 box (see MNIST calibration notes on
  // Yann LeCun's website)
  var canvasCopy = document.createElement("canvas");
  canvasCopy.width = imgData.width;
  canvasCopy.height = imgData.height;
  var copycontext = canvasCopy.getContext("2d");
  var brW = boundingRectangle.maxX+1-boundingRectangle.minX;
  var brH = boundingRectangle.maxY+1-boundingRectangle.minY;
  var scaling = 190 / (brW>brH?brW:brH);
  // scale
  copycontext.translate(canvas.width/2, canvas.height/2);
  copycontext.scale(scaling, scaling);
  copycontext.translate(-canvas.width/2, -canvas.height/2);
  // translate to center of mass
  copycontext.translate(trans.transX, trans.transY);

    copycontext.drawImage(context.canvas, 0, 0);



  // now bin image into 10x10 blocks (giving a 28x28 image)
  imgData = copycontext.getImageData(0, 0, 280, 280);
  grayscaleImg = imageDataToGrayscale(imgData);
  var nnInput = new Array(784);
  for (var y = 0; y < 28; y++) {
    for (var x = 0; x < 28; x++) {
      var mean = 0;
      for (var v = 0; v < 10; v++) {
        for (var h = 0; h < 10; h++) {
          mean += grayscaleImg[y*10 + v][x*10 + h];
        }
      }
      mean = (mean / 100); // average and invert
      nnInput[x*28+y] = (mean);

    }
  }
 

 // for visualization/debugging: paint the input to the neural net.
  if (document.getElementById('preprocessing').checked == true) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(copycontext.canvas, 0, 0);
    for (var y = 0; y < 28; y++) {
      for (var x = 0; x < 28; x++) {
        var block = context.getImageData(x * 10, y * 10, 10, 10);
        var newVal = 255 * (0.5 - nnInput[x*28+y]/2);
        for (var i = 0; i < 4 * 10 * 10; i+=4) {
          block.data[i] = newVal;
          block.data[i+1] = newVal;
          block.data[i+2] = newVal;
          block.data[i+3] = 255;
        }
        context.putImageData(block, x * 10, y * 10);

      }
    }
  }

    function nn(canvasInput){
      console.log('nn')
    };

  //for copy & pasting the digit into matlab
  //document.getElementById('nnInput').innerHTML=JSON.stringify(nnInput)+';<br><br><br><br>';
  var maxIndex = 0;
  //var nnOutput = nn(nnInput, w12, bias2, w23, bias3)
  //nnOutput.reduce(function(p,c,i){if(p<c) {maxIndex=i; return c;} else return p;});
  console.log('maxIndex: '+maxIndex);
 // document.getElementById('nnOut').innerHTML=maxIndex;
  clearBeforeDraw = true;
  var dt = new Date() - t1;

  console.log('recognize time: '+dt+'ms');
  console.log('nnInput: ', nnInput);
  (function(){
    $.ajax({
      type: 'GET', 
      url:'/trainedNetwork',
      data: {
        input: nnInput
      }
    })
  })();
}


// draws a line from (x1, y1) to (x2, y2) with nice rounded caps
function draw(context, color, lineWidth, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}

function erase() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('nnOut').innerHTML = '';
}

function findxy(res, e) {
  if (res == 'down') {
    if (clearBeforeDraw == true) {
      context.clearRect(0,0,canvas.width,canvas.height);
      document.getElementById('nnInput').innerHTML='';
      document.getElementById('nnOut').innerHTML='';
      paths = [];
      clearBeforeDraw = false;
      }

    if (e.pageX != undefined && e.pageY != undefined) {
      currX = e.pageX-canvas.offsetLeft;
      currY = e.pageY-canvas.offsetTop;
    } else {
      currX = e.clientX + document.body.scrollLeft
              + document.documentElement.scrollLeft
              - canvas.offsetLeft;
      currY = e.clientY + document.body.scrollTop
              + document.documentElement.scrollTop
              - canvas.offsetTop;
    }
    //draw a circle
    context.beginPath();
    context.lineWidth = 1;
    context.arc(currX,currY,lineWidth/2,0,2*Math.PI);
    context.stroke();
    context.closePath();
    context.fill();

    paths.push([[currX], [currY]]);
    paintFlag = true;
}
  if (res == 'up' || res == "out") {
      paintFlag = false;
      //console.log(paths);
  }

if (res == 'move') {
    if (paintFlag) {
        // draw a line to previous point
        prevX = currX;
        prevY = currY;
        if (e.pageX != undefined && e.pageY != undefined) {
          currX = e.pageX-canvas.offsetLeft;
          currY = e.pageY-canvas.offsetTop;
        } else {
          currX = e.clientX + document.body.scrollLeft
                  + document.documentElement.scrollLeft
                  - canvas.offsetLeft;
          currY = e.clientY + document.body.scrollTop
                  + document.documentElement.scrollTop
                  - canvas.offsetTop;
        }
        currPath = paths[paths.length-1];
        currPath[0].push(currX);
        currPath[1].push(currY);
        paths[paths.length-1] = currPath;
        draw(context, color, lineWidth, prevX, prevY, currX, currY);
    }
}
}
init();
