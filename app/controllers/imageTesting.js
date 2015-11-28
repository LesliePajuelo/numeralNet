var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d')

var erase = function(){
  context.clearRect(0, 0, canvas.width, canvas.height);
  clickX = [];
  clickY = [];
  clickDrag = [];
};

//Get mouse information
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

$('#canvas').mousedown(function(e){
  var mouseX = e.pageX - this.offsetLeft;
  var mouseY = e.pageY - this.offsetTop;
    
  paint = true;
  addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
  redraw();
});

$('#canvas').mousemove(function(e){
  if(paint){
    addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
    redraw();
  }
});

$('#canvas').mouseup(function(e){
  paint = false;
});

$('#canvas').mouseleave(function(e){
  paint = false;
});

var addClick = function(x,y,dragging){
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

var redraw = function(){
  context.clearRect(0,0, canvas.width, canvas.height);
  
  context.strokeStyle ="#ff0000";
  context.lineJoin = "round";
  context.lineWidth = 13;
  
  for(var i = 0; i < clickX.length; i++){
    context.beginPath();
    if(clickDrag[i] && i){
      context.moveTo(clickX[i-1], clickY[i-1]);
    
    } else {
      context.moveTo(clickX[i], clickY[i]);
    }
    context.lineTo(clickX[i], clickY[i]);
    context.closePath();
    context.stroke();
  }
};

//get numerical representation of canvas

var recognize = function(){

  var image = context.getImageData(0,0,canvas.width, canvas.height)
  
  var shadowCanvas = document.createElement('canvas');
  var shadowContext = shadowCanvas.getContext('2d');
  shadowCanvas.width = 28;
  shadowCanvas.height = 28;
  
  shadowContext.drawImage(canvas, 0,0,280,280,4,4,20,20);
  document.body.appendChild(shadowCanvas);
  var teeny = shadowContext.getImageData(0,0,shadowCanvas.width, shadowCanvas.height)
  console.log(teeny);

  //pull out red pixels

  var redValues = [];
  for(var i = 0; i < teeny.data.length; i = i + 4) {
    redValues.push(teeny.data[i]);
  }
  
   console.log(redValues);

  function renderResults(data) {
  function topTwo (data) {
    var index;
    var max;
    var highestProbs = [];

    function topOne(data) {
      index = data.indexOf(Math.max.apply(null, data));
      max = Math.max.apply(null, data);
      data.splice(index, 1, 0);
      
      return [index, (max*100).toPrecision(3) + '%'];
    };

    highestProbs.push(topOne(data));
    highestProbs.push(topOne(data));

    return highestProbs;
  };

    var highestProbs = topTwo(data)
    //[ [ 8, 1 ], [ 10, 0.99 ] ]

   var formattedData = '<p>Your number: <span class="digit">'+ highestProbs[0][0] + 
                       '</span> confidence: <span class="percent">' + 
                       highestProbs[0][1] + '</span></p> \n' +
                       '<p>Second possibility: <span class="digit">'+ 
                       highestProbs[1][0] + '</span> confidence: ' + 
                       '<span class="percent">' + highestProbs[1][1] +
                       '</span></p>';

    $('#results').html(formattedData).show;
  };

  (function() {
    $.ajax({
      type: 'POST', 
      url:'/trainedNetwork',
      data: {
        input: redValues
      },
      success: function(data){
        renderResults(data)
      }
    })
  })();


};
