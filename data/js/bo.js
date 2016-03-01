(function() {
  document.addEventListener('DOMContentLoaded', initBo, false);
  console.log('rec');
})();

var bo;

var userForRoom = [];
var roomList = [];
var friendCount = 0;
var userRoom = '';

function initBo(){
  var username = '';
  var isAuth = false;

  var bo = io();

  if(localStorage.getItem('myToken')){
    bo.emit("getToken", {token : localStorage.getItem('myToken')});

  } else{
    bo.emit("getToken", {token : "noToken"});
  }

  bo.on('credentials', function(data){
    bo.removeListener('credentials');
    bo.removeListener('getToken');
    document.getElementById('user').innerHTML = data.user;
    username = data.user;
    bo.emit('setUser', {username: username});
  });

  bo.on('unAuth', function(data){
    window.location.href = "/";
  });

  bo.on('welcome', function(data){
    console.log('fired');
    document.getElementById('rr').style.opacity = 0;
    document.getElementById('createRoom').style.opacity = 0;
    setTimeout(function(){
      document.getElementById('rr').style.visibility = 'hidden';
        document.getElementById('createRoom').style.visibility = 'hidden;'
    },500);
  });

  bo.on('getFriend', function(friendList){
    roomList = new Array();
    console.log(friendList);

    var count = 0;
    var parent = document.getElementById('people');

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    friendCount = 0;

    for(var i = 0; i < friendList.userList.length; i++){
      if(friendList.userList[i].username != username){
        friendCount++;

        var div = document.createElement('DIV');
        var secDiv = document.createElement('DIV');
        var thirdDiv = document.createElement('DIV');

        var iconDIV = document.createElement('DIV');
        var text = document.createElement('P');



        text.innerHTML = friendList.userList[i].username;
        div.className = "person-item";
        div.setAttribute("data-id", friendList.userList[i].socketID);
        div.setAttribute("data-name", friendList.userList[i].username);
        div.setAttribute("data-index", count);
        iconDIV.className = "icon_avatar";
        secDiv.className = "isOcc";
        thirdDiv.className = "innerOcc";
        thirdDiv.style.backgroundColor = "#54db74";

        div.appendChild(iconDIV);
        div.appendChild(text);
        div.appendChild(secDiv);
        secDiv.appendChild(thirdDiv);
        parent.appendChild(div);

        count++;
      }
    }

    var isOcc = document.getElementsByClassName('person-item');

    for(var j = 0; j < isOcc.length; j++){
      isOcc[j].addEventListener('click', addUserToRoom ,false);
    }
  });

  bo.on('saveRoom', function(data){
    userRoom = data;
    bo.emit('setGame', userRoom);
  });

  bo.on('join', function(room){
    swal({   title: "Do you want to join "+room.roomname+" ?", type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes",   closeOnConfirm: true },function(isConfirm){
      if(isConfirm){
        bo.emit('joinRoom', {ref: '', roomname : room.roomname});
      }
      else{
        bo.emit('joinRoom', {ref: 'refuse', roomname : room.roomname});
      }
    });

  });

  bo.on('refuse', function(){
      swal({   title: "Your friend refuse to join the party", type: "warning",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Close",   closeOnConfirm: true }, function(isConfim){
        resetEl();
        resetFriend();
      });
  });

  bo.on('getRoom', function(data){
  //  console.log('get room');
  //  console.log(data);
  //  bo.removeListener('getRoom');

    var parent = document.getElementById('room');

    // clear room component
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    for(var i = 0 ; i < data.length; i++){
      //console.log(roomList);
      var roomItem = document.createElement('DIV');
          roomName = document.createElement('P'),
          iconCont = document.createElement('icon_place'),
          smallIcon = document.createElement('smaller_icon');

        if(roomList[i] != data[i].roomname){
          roomItem.className = "room-item";
          console.log(data);
          roomName.innerHTML = data[i].roomname+" "+data[i].user_count+" / 4";

          iconCont.className = "icon_place";
          smallIcon.className = "smaller_icon";
          roomList.push(data[i].roomname);

          if(data[i].user_count < 3){
            smallIcon.style.color = "#4DDD6F";
          }
          else if(data[i].user_count == 3){
            smallIcon.style.color = "#E7BD59";
          }
          else{
            smallIcon.style.color = "#DB7654";
          }

          roomItem.appendChild(roomName);
          roomItem.appendChild(iconCont);
          iconCont.appendChild(smallIcon);

          parent.appendChild(roomItem);
        }
    }
  });

  bo.on('initGame', function(){

    // init canvas here -- test canvas
    initCanvas();




  });

  document.getElementById('disc').addEventListener('click', function(){
    localStorage.removeItem('myToken');
    bo.emit('remove', {user : username});
    window.location.href = '/';
  }, false);

  document.getElementById('createRoom').addEventListener('click', function(){
    createRoom(bo);
  } , false);
};

function addUserToRoom(){
  var toPush = true;
  var count = 0;

  while(count < friendCount && toPush){
  console.log(friendCount);
    if(userForRoom.length > 0){
      if(userForRoom[count] != undefined){
        console.log(this.childNodes[1].innerHTML);
        if(userForRoom[count].user != this.childNodes[1].innerHTML){
          toPush = true;
        }
        else{
          toPush = false;
      //    console.log('false');
        }
      }
    }

  //  console.log(toPush);

    count++;
  }

  if(toPush){
      userForRoom.push({user : this.getAttribute('data-name'), socketID : this.getAttribute("data-id")});
  }

  document.getElementsByClassName('innerOcc')[this.getAttribute('data-index')].style.backgroundColor = "#E7BD59";

  console.log(userForRoom);
}

function createRoom(io){
  bo = io;
  if(userForRoom.length >= 1 && userForRoom.length <= 4){
    document.getElementById('createRoom').style.opacity = 0;

    setTimeout(function(){
      document.getElementById('createRoom').style.visibility = "hidden";
      document.getElementById('rr').style.visibility = "visible";
      document.getElementById('rr').style.opacity = 1;
    }, 500);

    document.getElementById('validate').addEventListener('click', function(){
      var roomNameValue = document.getElementById('roomInput').value;
      if(roomNameValue){
      //  var ioEmit = io();
      //  console.log(ioEmit);
        bo.emit('createRoom', {userList : userForRoom, roomName : roomNameValue});
      }
    }, false);

    document.getElementById('cancel').addEventListener('click', function(){


      // reset the room array;
      userForRoom = new Array();
      resetEl();
      resetFriend();

    }, false);
  } else{
      swal({   title: "Please add a user to your list", type: "warning",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Close",   closeOnConfirm: false });
  }
}

function resetEl(){
  document.getElementById('rr').style.opacity = 0;
  setTimeout(function(){
    document.getElementById('createRoom').style.visibility = "visible";
    document.getElementById('rr').style.visibility = "hidden";
    document.getElementById('createRoom').style.opacity = 1;
  },500);
}

function resetFriend(){
  var friendList = document.getElementsByClassName('innerOcc');
  for(var i = 0 ; i< friendList.length; i++){
    friendList[i].style.backgroundColor = "#54db74";
  }
}

function initCanvas(){
  canvas.width = window.innerWidth - 200;
  canvas.height= window.innerHeight - 65;

  var can = new fabric.Canvas('canvas');

  var mycan = new _func_();
  mycan.generateCell(can);
  mycan.setUser(can);


  document.addEventListener('keypress', function(){
    console.log('fired bithc');
    mycan.updatePos(can);
    
  });
}

/* apple device */

function backingScale(context) {
    if ('devicePixelRatio' in window) {
        if (window.devicePixelRatio > 1) {
            return window.devicePixelRatio;
        }
    }
    return 1;
}

function _func_(can){
  this.can = can;
  var us;

  this.generateCell = function(can){
    var nbTale = canvas.width / 40;
    var hgTale = canvas.height / 40;
    for(var i = 0 ; i < nbTale; i++){
      for(var j = 0; j < hgTale; j++){
        can.add(new fabric.Rect({left: i*40, top: j*40, stroke : 'red', width: 40, height: 40, hasBorders : false, hasControls : false, selectable: false}));
      }
    }
  };

  this.setUser = function(can){
    us = new fabric.Circle({ radius: 30, fill: '#f55', top: 0, left: 0 , hasControls : false, hasBorders : false});
    can.add(us);
  }

  this.updatePos = function(can){
    us.set({left: 40});
    can.renderAll();
  }


}
