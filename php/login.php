<?php

// creer la connexion
$user = 'root';
$password = 'root';

$mysqli = new mysqli('localhost',$user,$password, 'laby') or die("erreur de connexion au serveur");

if($mysqli->connect_errno){
  echo 'error';
} else{

  $query = $mysqli->query("SELECT * FROM user WHERE login='".$_POST["login"]."' AND password='".$_POST["password"]."'");
  $row = $query -> num_rows;
  if($row) // Vérification du mot de passe contenu dans la BD
      {
      echo 'success';
      }
  else
      {
      echo 'error';
  }
}

?>
