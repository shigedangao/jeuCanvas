// depedencies
var express = require('express');
var file = require('fs');
var sql = require('mysql');
var path = require('path');
var validator = require('validator');
const crypto = require('crypto');
var http = require('http');
var querystring = require('querystring');
var jsontoken = require('jsonwebtoken');
const EventEmitter = require('events');


const secret = "chinese_girl";
const saveToken = new EventEmitter();

var app = express();
var server  = app.listen(3000);
var io = require('socket.io').listen(server);
// database remove when antony finish it's stuff

var user = [];
var roomList = [];
var answer = 0;
var received = 0;

// global socket;

app.get('/', function(req, res, next){
  // define a connection to the database // localhost, change if the server is different.
  app.use(express.static(__dirname + '/data'));
  res.sendFile(path.join(__dirname,'index.html'));

  io.on('connection', function(socket){

    socket.on('signup', function(data, err){
      if(validator.isEmail(data.email)){

        var signData = querystring.stringify({
          'login' : data.login,
          'password': crypto.createHmac('sha256', secret).update(data.password).digest('hex'),
          'mail': data.email
        });

        var reqSub = {
          hostname: 'localhost',
          port: 8888,
          path: '/LabyM/php/sign.php',
          method: 'POST',
          headers: {
             'Content-Type': 'application/x-www-form-urlencoded',
             'Content-Length': signData.length
          }
        }

        var req = http.request(reqSub, (resSign) => {
          resSign.setEncoding('utf8');
          resSign.on('data', (res) => {
            io.to(socket.id).emit('response', {result:res});
          });

          resSign.on('end', (res) => {
            console.log('No more data in response.');
          });
        });

        req.on('error', (e) => {
          console.log("error "+e);
          io.to(socket.id).emit('response', {result:"network"});
        })

        req.write(signData);
        req.end();
      } else{
        io.to(socket.id).emit('response', {result:"credentials"});
      }
    });

    // login

    socket.on('login', function(data){
      var logData = querystring.stringify({
        'login' : data.user,
        'password' : crypto.createHmac('sha256', secret).update(data.password).digest('hex')
      });

      var reqLog = {
        hostname: 'localhost',
        port: 8888,
        path: '/LabyM/php/login.php',
        method: 'POST',
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Content-Length': logData.length
        }
      }

      var logReq = http.request(reqLog, (result) =>{
        result.setEncoding('utf8');
        result.on('data', (myRes) => {
          if(myRes == "success"){
            var token = jsontoken.sign({login : data.user}, "codingagainagain..");
            io.to(socket.id).emit('logRes', {result:"dolog", myToken : token});
          } else{
            io.to(socket.id).emit('logRes', {result:"credentials"});
          }
        });

        result.on('error', (e) =>{
          //console.log(e);
          io.to(socket.id).emit('logRes', {result:"credentials"});
        });
      });

      logReq.write(logData);
      logReq.on('error', (e) =>{
        io.to(socket.id).emit('logRes', {result:"error"});
      });

      logReq.end();
    });
  });
});


app.get('/home' ,function(req, res){
  app.use(express.static(__dirname + '/data'));
  res.sendFile(path.join(__dirname,'home.html'));

  // connection check if the token exist
  io.on('connection', function(socket){
    // remove login listener to avoid event leaking
    socket.on('getToken', (e) =>{

      if(e.token != "noToken"){
        var deserialize = jsontoken.verify(e.token, 'codingagainagain..', function(err, decoded){
        //  console.log(decoded);
          io.to(socket.id).emit('credentials', {user : decoded.login});
        });
      } else{
        socket.emit("unAuth", {res : "noAuth"});
      }
    });

    socket.on('setUser', (e) =>{
      var countUsr = 0;
      var isNotPresent = true;
      while(countUsr < user.length && isNotPresent){
        if(e.username == user[countUsr].username){
          isNotPresent = false;
        }
        countUsr++;
      }

      if(isNotPresent){
        user.push({username : e.username, socketID : socket.id});
      }

      io.sockets.emit('getRoom', roomList);
      io.sockets.emit('getFriend', {userList : user});
    });


    socket.on('remove', function(username){
      for(var i = 0 ; i < user.length; i++){
        if(user[i].username == username.user){
          user.splice(i,i);
        }
      }

      console.log(user);

      io.sockets.emit('getFriend', {userList : user});
    });

    socket.on('createRoom', function(room){
      received = 0;
      socket.join(room.roomName);
      for(var i =0; i < room.userList.length; i++){
        io.to(room.userList[i].socketID).emit('join',{roomname : room.roomName, emiterUser : socket.id});

      }

      answer = room.userList.length+1;
    });

    socket.on('joinRoom', function(room){
      if(room.ref != "refuse"){
        socket.join(room.roomname);

        io.in(room.roomname).clients(function(error, clients){
          console.log('received '+received);
          console.log(clients);
          console.log(answer);
          if(received == answer){
            roomList.push({roomname : room.roomname, user_count : clients.length});
            io.sockets.emit('getRoom', roomList);
            io.sockets.in(room.roomname).emit('initGame');
          }

        });

        io.sockets.in(room.roomname).emit('welcome', 'hey');
        received++;
      } else{
        io.in(room.roomname).clients(function(error, clients){
            if(clients.length == 1){
              io.to(clients[0]).emit('refuse','refuse');
              socket.leave(room.roomname);
            }
        });
      }
    });


    /* ---------------------- room property ---------------------- */

    socket.on('initGame', function(){
      
    });


  });
});
