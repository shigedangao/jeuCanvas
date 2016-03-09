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
var mySocketID;
var totalPlayer = 0;
var playerSideBar;
var userArray = new Array();
var pl;
var username;
var rm = false;
var already = false;


var otherUserPos = new Array();


var userOne,
    userTwo,
    userThree,
    userFour;

// USER ID WILL DEFINE THE INDEX ON THE ARRAY TO EMIT TO THE OTHER USER PRESENT IN THE ROOM

var userID ;

function initBo(){
  username = '';
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
    document.getElementById('rr').style.opacity = 0;
    document.getElementById('createRoom').style.opacity = 0;
    setTimeout(function(){
      document.getElementById('rr').style.visibility = 'hidden';
        document.getElementById('createRoom').style.visibility = 'hidden;'
    },500);
  });

  bo.on('getFriend', function(friendList){
    roomList = new Array();

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
    already = true;
    console.log('once');
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
    console.log('room fired');
  //  console.log('get room');
  //  console.log(data);
  //  bo.removeListener('getRoom');

    var parent = document.getElementById('room');

    // clear room component
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    roomList = [];



    for(var i = 0 ; i < data.length; i++){
      //console.log(roomList);
      if(data[i].roomname){
        var roomItem = document.createElement('DIV');
            roomName = document.createElement('P'),
            iconCont = document.createElement('icon_place'),
            smallIcon = document.createElement('smaller_icon');

          if(roomList[i] != data[i].roomname){
            roomItem.className = "room-item";
            roomName.innerHTML = data[i].roomname+" "+data[i].user_count+" / 4";

            iconCont.className = "icon_place";
            smallIcon.className = "smaller_icon";


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



            roomList.push(data[i].roomname);
          }
      }

      try{

          userArray = new Array();
      //  console.log('try');
      //  console.log('length '+data[0].user_count);
          mySocketID = bo.io.engine.id;
          for(var loop = 0; loop < data[i].user_count; loop++){
            var unknowuser = data[i].alluser[loop].split('/#')[1];
          //  console.log('unknow '+unknowuser);
          //  console.log('me '+mySocketID);
            if(unknowuser == mySocketID){
              userID = loop;
              userArray.push(userID);
            //  console.log(userID);
            } else{
              userArray.push(loop);
              totalPlayer++;

            }
          }

          debugger;

          //console.log(data[0].user_count);
      }
      catch(err){

      }
    }
//    debugger;
  });

  bo.on('initGame', loadGame);

  function loadGame(data){
    data = JSON.parse(data);
  //  bo.removeListener('initGame');

    if(already){
      initCanvas(data, bo);
      already = false;
    }


    //rm = true;
  }


  bo.on('message', function(data){
    mycan.setPosOfOther(data);
  });

  bo.on('noMoreUsr', function(){
      swal({   title: "A user has quit the party. This room will be destroy.", type: "warning",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Close",   closeOnConfirm: true}, function(isConfirm){
        mycan.clearCanvas();
        bo.emit('destroyRoom', userRoom);
        resetEl();
        playerSideBar.style.left = "-170px";
      });
  })

  bo.on('loose', function(data){
    swal({title: "You have lost :(. The winner is "+data ,type: "info",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Close",   closeOnConfirm: true}, function(isConfirm){
      mycan.clearCanvas();
      bo.emit('quitRoom', userRoom);
      resetEl();
      playerSideBar.style.left = "-170px";
    });
  })

  bo.on('error', function(){
    swal({title: "error while trying to update your score :("+data ,type: "info",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Close",   closeOnConfirm: true});
  })

  bo.on('updateUsr', function(){

  })

  /* ------------------- DOM LISTENER ------------------- */

  document.getElementById('disc').addEventListener('click', function(){
    localStorage.removeItem('myToken');
    bo.emit('remove', {user : username});
    window.location.href = '/';
  }, false);

  document.getElementById('createRoom').addEventListener('click', function(){
    createRoom(bo);
  } , false);


  document.getElementById('quit').addEventListener('click', function(){
    mycan.clearCanvas();
    resetEl();
    bo.emit('quitRoom', userRoom);
    playerSideBar.style.left = "-170px";
  }, false);

  document.getElementById('rot').addEventListener('click', function(){
  });


  playerSideBar = document.getElementById('side_user');
};



function addUserToRoom(){
  var toPush = true;
  var count = 0;

  while(count < friendCount && toPush){
    if(userForRoom.length > 0){
      if(userForRoom[count] != undefined){
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
  console.log('haha');
  canvas.width = window.innerWidth - 450;
  canvas.height= window.innerHeight - 55;

  can = new fabric.Canvas('canvas');

  mycan = new _func_(can, bo);
  mycan.generateCell(can, data);
  mycan.setPlace();
  mycan.setUser(can);
  mycan.setSlaveUser();
  mycan.an();

  // display the sidebar.
  playerSideBar.style.left = '0px';


  document.addEventListener('keypress', function(e){

    var keyCode = e.keyCode || e.which

    if(keyCode == 115){
      mycan.updatePos('left');
    }
    else if(keyCode == 122){
      mycan.updatePos('forward');
    }
    else if(keyCode == 113){
      mycan.updatePos('backward');
    }
    else if(keyCode == 100){
      mycan.updatePos('right');
    }

    mycan.updatePos(can);

  }, true);
}


function _func_(can, bo){
  var bo = bo;
  this.can = can;
  var us;
  var dim = Math.floor(canvas.width/29);
  var nbTale = canvas.width / 30;
  var hgTale = canvas.height / 35;

   var target = nbTale * 10;
   var hgTarg = hgTale * 15;




  this.generateCell = function(can, data){


    //console.log(data);

    for(var i = 0 ; i < data.length; i++){
      var x = Math.floor(i%20)*dim;
      var y = Math.floor(i/20)*dim;

      if(data[i]["N"]<0){
        var line = new fabric.Line([x,y,x+dim,y], {fill: '#4D4941', stroke : '#4D4941', strokeWidth : 4, selectable : false, hasControls : false});
        can.add(line);
      }

      if(data[i]["S"]<0){
        can.add(new fabric.Line([x,y+dim,x+dim,y+dim], {fill: '#4D4941', stroke : '#4D4941', strokeWidth : 4, selectable : false}));
      }

      if(data[i]["E"]<0){
        can.add(new fabric.Line([x+dim,y,x+dim,y+dim], {fill: '#4D4941', stroke : '#4D4941', strokeWidth : 4, selectable : false}));
      }

      if(data[i]["O"]<0){
        can.add(new fabric.Line([x,y,x,y+dim], {fill: '#4D4941', stroke : '#4D4941', strokeWidth : 4, selectable : false}));
      }
    }

  };

  this.setUser = function(){
    us = new fabric.Circle({ radius: 5, fill: '#f55', top: 15, left: 10 , hasControls : false, hasBorders : false});
    can.add(us);
  }

  this.setSlaveUser = function(){
    console.log(userArray);
    for(var user = 0 ; user < userArray.length; user++){

      if(userArray[user] != userID){

        if(user == 0){
          userOne = new fabric.Circle({radius : 5,fill: '#F28B93', top: 15, left: 10 , hasControls : false, hasBorders : false});
          can.add(userOne);
        }
        if(user == 1){
          userTwo = new fabric.Circle({radius : 5,fill: '#000000', top: 15, left: 10 , hasControls : false, hasBorders : false});
          can.add(userTwo);
        }
        else if(user == 2){
          userThree = new fabric.Circle({radius: 5, fill: '#EEEEEE', top: 15, left: 10, hasControls: false, hasBorders: false});
          can.add(userThree);
        }
        else if(user == 3){
          userFour = new fabric.Circle({radius: 5, fill: '#EEEEEE', top: 15, left: 10, hasControls: false, hasBorders: false});
          can.add(userFour);
        }
      }
    //  console.log('index usr '+user);
    }


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
          console.log(totalPlayer+1);
          otherUserPos = new Array(totalPlayer+1);
        //  var userPos = {posX: us.left, posY : us.top};
          otherUserPos[userID] = {posX: us.left, posY : us.top};
      //    console.log(otherUserPos);
          bo.emit('move', {roomName: userRoom, userPos : otherUserPos});
          //bo.emit('move', {roomName : userRoom, posX : us.left, posY : us.top });

          us.setCoords();
          can.renderAll();
        }
        colCount++;
      }
    }

    // check intersection with the target
    if(us.intersectsWithObject(pl)){
      swal({title: "Oh sir you won !!" ,type: "info",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Close",   closeOnConfirm: true}, function(isConfirm){
        mycan.clearCanvas();
        bo.emit('winner', {winner : username, roomname : userRoom, sockID : mySocketID});
        bo.emit('destroyRoom', userRoom);
        resetEl();
        playerSideBar.style.left = "-170px";
      });
    }
  }

  this.setPosOfOther = function(data){
    otherUserPos = data;
  //  console.log(data);

  //  console.log(data.userPos);

    for(var u = 0 ; u < data.userPos.length; u++){

      if(u != userID){
        if(data.userPos[u] != null){
          if(u == 0){
            userOne.set({left: data.userPos[u].posX, top: data.userPos[u].posY});
          }
          else if(u == 1){
            userTwo.set({left: data.userPos[u].posX, top: data.userPos[u].posY});
          }
          else if(u == 2){
            userThree.set({left: data.userPos[u].posX, top: data.userPos[u].posY});
          }
          else if(u == 3){
            userFour.set({left: data.userPos[u].posX, top: data.userPos[u].posY});
          }
        }
        //  console.log(u);
        //console.log(data[1]);

      }
    }
//    us.set({left: x, top: y});
    can.renderAll();
  },

  this.clearCanvas = function(){
    can.clear();
    mycan = 0;
  },


  this.setPlace = function(){
    // left : target , top : hgTarg
    pl = new fabric.Rect({left: 50, top: 50, fill: '#D9D6D0', width: 20, height: 20, hasBorders : false, hasControls : false, selectable: false, originX : 'center', originY : 'center'});
    can.add(pl);
  }


  this.an = function(){
    pl.animate('angle', '+=20', {
      duration: 3000,
      onChange: can.renderAll.bind(can),
      onComplete : function(){
        try{
          mycan.an();
        }
        catch(err){
          console.log('function terminated');
        }

      }
    });
  }

}
