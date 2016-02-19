// depedencies
var express = require('express');
var file = require('fs');
var sql = require('mysql');
var path = require('path');
var validator = require('validator');
const crypto = require('crypto');
var http = require('http');
var querystring = require('querystring');


const secret = "chinese_girl";

var app = express();
var server  = app.listen(3000);
var io = require('socket.io').listen(server);

// database remove when antony finish it's stuff

var user = {};

app.get('/', function(req, res){


  // define a connection to the database // localhost, change if the server is different.

  app.use(express.static(__dirname + '/data'));
  res.sendFile(path.join(__dirname,'index.html'));

  io.on('connection', function(socket){

    // signup
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
            socket.emit('response', {result:res});
          });

          resSign.on('end', (res) => {
            console.log('No more data in response.');
          });
        });

        req.on('error', (e) => {
          console.log("error "+e);
          socket.emit('response', {result:"network"});
        })

        req.write(signData);
        req.end();
      } else{
        socket.emit('response', {result:"credentials"});
      }
    });

    // login

    socket.on('login', function(data){
      // request

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
          console.log(myRes);
          if(myRes == "success"){
            socket.emit('logRes', {result:"dolog"});
          } else{
            socket.emit('logRes', {result:"credentials"});
          }
        });

        result.on('error', (e) =>{
          //console.log(e);
          socket.emit('logRes', {result:"credentials"});
        });
      });

      logReq.write(logData);

      logReq.on('error', (e) =>{
        socket.emit('logRes', {result:"error"});
      });

      logReq.end();
    });
  });
});

app.get('/home', function(req, res){
  res.send('hi');
});
