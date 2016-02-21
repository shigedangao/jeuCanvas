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

  document.getElementById('sign').addEventListener('click',function(e){
    e.preventDefault();
    trans(true);
  }, false);

  document.getElementById('back').addEventListener('click', function(e){
    e.preventDefault();
    trans(false);
  }, false);

  document.getElementById('subscribe').addEventListener('click', subscribe, false);
  document.getElementById('log').addEventListener('click', login, false);

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

function trans(add){
  if(add){
    document.getElementById('body').classList.remove('toUp');
    document.getElementById('body').classList.add('toDown');
  }
  else {
    document.getElementById('body').classList.remove('toDown');
    document.getElementById('body').classList.add('toUp');
  }
}

function login(e){
  e.preventDefault();
  var isFill = false;
  var data = document.getElementsByClassName('log_input');
  for(var i = 0; i < data.length; i++){
    if(data[i].value){
      isFill = true;
    } else{
      isFill = false;
    }
  }

  if(isFill){
    var logSocket = io();
    logSocket.emit('login',{user:data[0].value, password:data[1].value});

    var el = document.getElementById('topbar_log');

    logSocket.on("logRes", function(data){
      console.log(data);
      if(data.result == "error"){
        el.childNodes[0].innerHTML = 'network error';
        el.style.backgroundColor = "#fa6c6c";
      }
      else if(data.result == "dolog"){
        console.log(data.result);
        localStorage.setItem('myToken', data.myToken);
        debugger;
        window.location.href="home";
      }
      else{
        el.childNodes[0].innerHTML = 'wrong login or password';
        el.style.backgroundColor = "#fa6c6c";
      }
    });
  }
}

function subscribe(e){
  // disable the default event
  e.preventDefault();

  var input = document.getElementsByClassName('inputSub'),
      isFull = false;

  for(var i = 0; i < input.length; i++){
    if(input[i].value){
      isFull = true;
      input[i].style.borderColor = "#394457";
    } else{
      isFull = false;
      input[i].style.borderColor = "#fa6c6c";
    }
  }


  if(isFull){
    var topbar = document.getElementById('topbar');
    var socket = io();
    socket.emit('signup',{login:input[0].value, password: input[1].value, email: input[2].value});

    socket.on('response', function(data){
      console.log(data.result);
      switch(data.result){
        case "network":
          topbar.childNodes[0].innerHTML = 'network error';
          topbar.style.backgroundColor = "#fa6c6c";
        break;
        case "success":
          topbar.childNodes[0].innerHTML = 'Congratulations';
          topbar.style.backgroundColor = "#c2e392";
        break;
        case "error":
          topbar.childNodes[0].innerHTML = 'retry';
          topbar.style.backgroundColor = "#fa6c6c";
        break;
        case "user exist":
          topbar.childNodes[0].innerHTML = 'a user already exist';
          topbar.style.backgroundColor = "#fa6c6c";
        break;
        case "credentials":
          topbar.childNodes[0].innerHTML = 'invalid email';
          topbar.style.backgroundColor = "#fa6c6c";
        break;
      }
    }, function(err){
      console.log(err);
    })
  }
}
