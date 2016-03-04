(function() {
  document.addEventListener('DOMContentLoaded', initBo, false);
  console.log('rec');
})();

var bo;

var userForRoom = [];
var roomList = [];
var friendCount = 0;
var userRoom = '';
var mycan;
var can;

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

  bo.on('initGame', function(data){
    data = JSON.parse(data);
    bo.removeListener('initGame');


    initCanvas(data, bo);

  });


  bo.on('message', function(data){
    mycan.setPosOfOther(data.posX, data.posY);
  });

  /* ------------------- DOM LISTENER ------------------- */

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

function initCanvas(data, bo){

  canvas.width = window.innerWidth - 200;
  canvas.height= window.innerHeight - 65;

  can = new fabric.Canvas('canvas');

  mycan = new _func_(can, bo);
  mycan.generateCell(can, data);
  mycan.setUser(can);


  document.addEventListener('keypress', function(e){
    if(e.keyCode == 115){
      mycan.updatePos('left');
    }
    else if(e.keyCode == 122){
      mycan.updatePos('forward');
    }
    else if(e.keyCode == 113){
      mycan.updatePos('backward');
    }
    else if(e.keyCode == 100){
      mycan.updatePos('right');
    }

    mycan.updatePos(can);

  }, true);



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

function _func_(can, bo){
  var bo = bo;
  this.can = can;
  var us;

  this.generateCell = function(can, data){
    var nbTale = canvas.width / 40;
    var hgTale = canvas.height / 40;
    var dim = Math.floor(canvas.width/20);

    for(var i = 0 ; i < data.length; i++){
      var x = (i%20)*dim;
      var y = Math.floor(i/20)*dim;

      if(data[i]["N"]<0){
        can.add(new fabric.Line([x,y,x+dim,y], {fill: 'red', stroke : 'red', strokeWidth : 1, selectable : false}));
      }

      if(data[i]["S"]<0){
        can.add(new fabric.Line([x,y+dim,x+dim,y+dim], {fill: 'red', stroke : 'red', strokeWidth : 1, selectable : false}));
      }

      if(data[i]["E"]<0){
        can.add(new fabric.Line([x+dim,y,x+dim,y+dim], {fill: 'red', stroke : 'red', strokeWidth : 1, selectable : false}));
      }

      if(data[i]["O"]<0){
        can.add(new fabric.Line([x,y,x,y+dim], {fill: 'red', stroke : 'red', strokeWidth : 1, selectable : false}));
      }


    }
  };

  this.setUser = function(){
    us = new fabric.Circle({ radius: 5, fill: '#f55', top: 0, left: 0 , hasControls : false, hasBorders : false});
    can.add(us);
  }

  this.updatePos = function(direction){
    var oldPosX = us.left;
    var oldPosY = us.top;
    switch(direction){
      case 'left':
        var left = us.left;
        us.set({left : left+5});
      break;
      case 'forward':
        var top = us.top;
        us.set({top: top+5});
      break;
      case 'backward':
        var bottom = us.top;
        us.set({top: bottom-5});
      break;
      case 'right':
        var right = us.left;
        us.set({left : right- 5});
      break;
    }

    //us.set({left: 40});



    // check collision


    var item = can.getObjects();
    var colCount = 0;
  //  console.log(item);
    for(var i = 0 ; i < item.length; i++){
      if(us.intersectsWithObject(item[i])){
        if(colCount > 1){
          console.log('collision');
          us.set({left: oldPosX, top: oldPosY});
          us.setCoords();
          can.renderAll();
        }
        else{
          bo.emit('move', {roomName : userRoom, posX : us.left, posY : us.top });

          us.setCoords();
          can.renderAll();
        }
        colCount++;
      }
    }
  }

  this.setPosOfOther = function(x,y){
    us.set({left: x, top: y});
    can.renderAll();
  }
}
