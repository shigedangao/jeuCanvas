(function() {
  document.addEventListener('DOMContentLoaded', initCanvas, false);
})();

function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

function initCanvas(){

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var scaleFactor = backingScale(ctx);

  canvas.width = window.innerWidth * scaleFactor;
  canvas.height= window.innerHeight * scaleFactor;

  const size = 300;
  var previousX = 0,
      previousY = 0,
      randX = 0,
      randY = 0;

  for(var i = 0; i < size; i++){
    if(i%2 == 0){
      randX = Math.round(Math.random() * (canvas.width - 0) + 0);
    } else{
      randY = Math.round(Math.random() * (canvas.height - 0) + 0);
    }

    drawCanvas(previousX, previousY, randX, randY);

    //console.log("pX "+previousX+" pY"+previousY+" rX "+randX+" rY "+randY);
    //debugger;
    previousX = randX;
    previousY = randY;
  }
}

function drawCanvas(previousX, previousY, nextPointX, nextPointY){
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.beginPath();
  context.moveTo(previousX, previousY);
  context.lineTo(nextPointX, nextPointY);
  context.lineWidth = 2;
  context.strokeStyle = '#CFCBC5';
  context.stroke();
}
