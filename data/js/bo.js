(function() {
  document.addEventListener('DOMContentLoaded', initBo, false);
  console.log('rec');
})();

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
    console.log('la');
    // remove all node
    var parent = document.getElementById('people');

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    for(var i = 0; i < friendList.userList.length; i++){
      if(friendList.userList[i].username != username){
        var div = document.createElement('DIV');
        var iconDIV = document.createElement('DIV');
        var text = document.createElement('P');

        text.innerHTML = friendList.userList[i].username;
        div.className = "person-item";
        div.setAttribute("data-id", friendList.userList[i].socketID);
        iconDIV.className = "icon_avatar";

        div.appendChild(iconDIV);
        div.appendChild(text);
        parent.appendChild(div);
      }
    }
  });

  bo.on('test', function(){
    console.log('ok');
  });

  document.getElementById('disc').addEventListener('click', function(){
    localStorage.removeItem('myToken');
    bo.emit('remove', {user : username});
    window.location.href = '/';
  }, false);
};
