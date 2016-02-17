var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');


app.use(express.static(__dirname + 'log'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/login', function(req, res){
  res.sendFile(path.join(__dirname, '../','index.html'));
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
