(function() {
  document.addEventListener('DOMContentLoaded', initBo, false);
  console.log('rec');
})();

var userForRoom = [];

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

  bo.on('getFriend', function(friendList){
    //bo.removeListener('getFriend');
    // remove all node
    var parent = document.getElementById('people');

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    for(var i = 0; i < friendList.userList.length; i++){
      if(friendList.userList[i].username != username){
        var div = document.createElement('DIV');
        var secDiv = document.createElement('DIV');
        var thirdDiv = document.createElement('DIV');

        var iconDIV = document.createElement('DIV');
        var text = document.createElement('P');



        text.innerHTML = friendList.userList[i].username;
        div.className = "person-item";
        div.setAttribute("data-id", friendList.userList[i].socketID);
        div.setAttribute("data-name", friendList.userList[i].username);
        iconDIV.className = "icon_avatar";
        secDiv.className = "isOcc";
        thirdDiv.className = "innerOcc";
        thirdDiv.style.backgroundColor = "#54db74";

        div.appendChild(iconDIV);
        div.appendChild(text);
        div.appendChild(secDiv);
        secDiv.appendChild(thirdDiv);
        parent.appendChild(div);
      }
    }

    var isOcc = document.getElementsByClassName('person-item');

    for(var j = 0; j < isOcc.length; j++){
      isOcc[j].addEventListener('click', addUserToRoom ,false);
    }

    console.log(isOcc);
  });

  bo.on('test', function(){
    console.log('ok');
  });

  document.getElementById('disc').addEventListener('click', function(){
    localStorage.removeItem('myToken');
    bo.emit('remove', {user : username});
    window.location.href = '/';
  }, false);

  document.getElementById('createRoom').addEventListener('click', createRoom , false);
};

function addUserToRoom(){

  for(var e = 0; e < userForRoom.length; e++){
    if(userForRoom[e].user == this.innerHTML){
      userForRoom.push({user : this.getAttribute('data-name'), socketID : this.getAttribute("data-id")});
    }
  }

  if(userForRoom.length == 0){
    userForRoom.push({user : this.getAttribute('data-name'), socketID : this.getAttribute("data-id")});
  }

  console.log(userForRoom);

}

function createRoom(){
  document.getElementById('createRoom').style.opacity = 0;

  setTimeout(function(){
    document.getElementById('createRoom').style.visibility = "hidden";
    document.getElementById('rr').style.visibility = "visible";
    document.getElementById('rr').style.opacity = 1;
  }, 500);


  document.getElementById('validate').addEventListener('click', function(){
    var ioEmit = io();
    io.emit('createRoom', {userList : userForRoom});
  }, false);

}
