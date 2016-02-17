// depedencies
var express = require('express');
var sql = require('mysql');
var path = require('path');
var validator = require('validator');



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

app.get('/', function(req, res){

  // define a connection to the database // localhost, change if the server is different.

  app.use(express.static(__dirname + '/data'));
  res.sendFile(path.join(__dirname,'index.html'));


  io.on('connection', function(socket){

    socket.on('signup', function(data){
      console.log(data);
      if(validator.isEmail(data.email)){
        connectionCredential.getConnection(function(err, connection){
          if(err){
          //  console.log(err);
            socket.emit('response', {result:"network"});
          } else {
          //  console.log("SELECT * FROM user WHERE login='"+data.login+"' OR mail='"+data.email+"'");
            connection.query("SELECT * FROM user WHERE login='"+data.login+"' OR mail='"+data.email+"'", function(err, res){
              console.log(res.length);
              if(res.length == 0){
                connection.query("INSERT INTO user (login, password, mail) VALUES ('"+data.login+"','"+data.password+"','"+data.email+"')", function(err){
                  if(err){
                    socket.emit('response', {result:"error"});
                  }
                  else{
                    socket.emit('response', {result:"success"});
                    connection.release();
                  }
                });
              } else{
              //console.log(err);
                socket.emit('response', {result:"user exist"});
              }
            });
          }
        });
      } else{
        socket.emit('response', {result:"credentials"});
      }

    });

  });

});
