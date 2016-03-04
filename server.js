var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


  // On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'chat'
  
 
app.use("/", express.static(__dirname + "/chat"));

io.on('connection', function (socket) {

  
   // Connexion et déconnexion des utilisateurs
   
  console.log('Utilisateur connecté');
  socket.on('disconnect', function () {
    console.log('Utilisateur déconnecté');
  });

  
	  // On réceptionne l'événement 'chat-message'
    socket.on('chat-message', function (message) {
	  // On renvoi l'événement 'chat-message' vers tous les utilisateurs
    io.emit('chat-message', message);
  });
});


  // On lance le serveur et on écoute les connexions arrivant sur le port 3000
 
http.listen(3000, function () {
  console.log('Server is listening on *:3000');
});
