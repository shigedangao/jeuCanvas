<?php

// creer la connexion
$user = 'root';
$password = 'root';

$req = mysql_connect('localhost',$user,$password, 'laby') or die("erreur de connexion au serveur");

if(!$req){
  echo ('error' .mysql_error());
} else{

  $query = $req->query("SELECT * FROM user WHERE login='".$_POST["login"]."' AND password='".$_POST["password"]."'");
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