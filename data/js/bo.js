(function() {
  document.addEventListener('DOMContentLoaded', initBo, false);
})();



function initBo(){
  var username = '';
  console.log('fired');

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
    bo.removeListener('setUser');
    bo.removeListener('getFriend');
    var parent = document.getElementById('people');
    console.log(friendList);
    for(var i = 0; i < friendList.userList.length; i++){
      if(friendList.userList[i].username != username){
        console.log(friendList.userList[i].username);
        var div = document.createElement('DIV');
        var iconDIV = document.createElement('DIV');
        var text = document.createElement('P');

        text.innerHTML = friendList.userList[i].username;
        div.className = "person-item";
        iconDIV.className = "icon_avatar";

        div.appendChild(iconDIV);
        div.appendChild(text);
        parent.appendChild(div);
      }
    }
  });
}
