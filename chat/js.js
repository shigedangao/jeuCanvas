var socket = io();

	// Envoi du message
$('#chat form').submit(function (e) {
  e.preventDefault();
  var message = {
    text : $('#mess').val()
  };
  $('#mess').val('');
  if (message.text.trim().length !== 0) { // Gestion du message vide
    socket.emit('chat-message', message);
  }
  $('#chat input').focus(); // Focus sur le champ du message
});

	// Réception du message
socket.on('chat-message', function (message) {
  $('#messages').append($('<li>').text(message.text));
});