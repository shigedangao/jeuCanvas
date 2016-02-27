(function() {
  document.addEventListener('DOMContentLoaded', initBo, false);
  console.log('rec');
})();

var bo;

var userForRoom = [];
var friendCount = 0;

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
    //bo.removeListener('getFriend');
    // remove all node
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

    console.log(isOcc);
  });

  bo.on('join', function(room){
    swal({   title: "Do you want to join "+room+" ?", type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Yes",   closeOnConfirm: true },function(isConfirm){
      if(isConfirm){
        bo.emit('joinRoom', room);
        bo.removeListener('joinRoom');
      }
      else{
        bo.emit('joinRoom', 'refuse');
      }
    });

  });

  bo.on('refuse', function(){
      swal({   title: "Your friend refuse to join the party", type: "warning",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Close",   closeOnConfirm: true });
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
  for(var e = 0; e < friendCount-1; e++){
    console.log(e);
    console.log(friendCount);
    if(userForRoom.length > 0){
      if(userForRoom[e].user != this.innerHTML){
        userForRoom.push({user : this.getAttribute('data-name'), socketID : this.getAttribute("data-id")});
      }
    } else{
        userForRoom.push({user : this.getAttribute('data-name'), socketID : this.getAttribute("data-id")});
    }
  }

  if(userForRoom.length == 0){
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
      document.getElementById('rr').style.opacity = 0;

      // reset the room array;
      userForRoom = new Array();
      resetFriend();
      setTimeout(function(){
        document.getElementById('createRoom').style.visibility = "visible";
        document.getElementById('rr').style.visibility = "hidden";
        document.getElementById('createRoom').style.opacity = 1;
      },500);
    }, false);
  } else{
      swal({   title: "Please add a user to your list", type: "warning",   showCancelButton: false,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Close",   closeOnConfirm: false });
  }
}

function resetFriend(){
  var friendList = document.getElementsByClassName('innerOcc');
  for(var i = 0 ; i< friendList.length; i++){
    friendList[i].style.backgroundColor = "#54db74";
  }
}
