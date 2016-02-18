// depedencies
var express = require('express');
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

        var req = http.request(reqSub, (res) => {
          res.setEncoding('utf8');
          res.on('data', (res) => {
            socket.emit('response', {result:res});
          });

          res.on('end', (res) => {
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
