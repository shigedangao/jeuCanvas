// depedencies
var express = require('express');
var sql = require('mysql');
var path = require('path');
var validator = require('validator');
const crypto = require('crypto');
const secret = "chinese_girl";

var app = express();
var server  = app.listen(3000);
var io = require('socket.io').listen(server);

// database
var connectionCredential = sql.createPool({
  connectionLimit: 20,
  host : '127.0.0.1:3306',
  user : 'root',
  password : 'root',
  database : 'laby',
  socketPath : "/Applications/MAMP/tmp/mysql/mysql.sock"
});

var user = {};

app.get('/', function(req, res){

  // define a connection to the database // localhost, change if the server is different.

  app.use(express.static(__dirname + '/data'));
  res.sendFile(path.join(__dirname,'index.html'));

  io.on('connection', function(socket){

    // signup

    socket.on('signup', function(data){
      if(validator.isEmail(data.email)){
        connectionCredential.getConnection(function(err, connection){
          if(err){
            socket.emit('response', {result:"network"});
          } else {
            connection.query("SELECT * FROM user WHERE login='"+data.login+"' OR mail='"+data.email+"'", function(err, res){
              if(res.length == 0){

                const hash = crypto.createHmac('sha256', secret).update(data.password).digest('hex');

                connection.query("INSERT INTO user (login, password, mail) VALUES ('"+data.login+"','"+hash+"','"+data.email+"')", function(err){
                  if(err){
                    socket.emit('response', {result:"error"});
                  }
                  else{
                    socket.emit('response', {result:"success"});
                    connection.release();
                  }
                });
              } else{
                socket.emit('response', {result:"user exist"});
              }
            });
          }
        });
      } else{
        socket.emit('response', {result:"credentials"});
      }

    });

    // login

    socket.on('login', function(data){
      var checkPassword = crypto.createHmac('sha256', secret).update(data.password).digest('hex');
    //  console.log(checkPassword);
      connectionCredential.getConnection(function(err, connection){
        if(err){
        //  console.log("erreur");
          socket.emit('logRes', {result:"error"});
        } else{
          // check if the user exist and check if the password is right
          connection.query("SELECT * FROM user WHERE login='"+data.user+"' AND password='"+checkPassword+"'", function(err, res){
            if(res.length != 0){
              console.log('ok right');
              // now i think that we need to use express session
            } else{
              console.log("not right");
              socket.emit('logRes', {result:"credentials"});
            }
          })
        }
      })
    });

  });

});
