<?php
$user = 'root';
$password = 'root';

$mysqli = new mysqli('localhost',$user,$password, 'laby') or die("erreur de connexion au serveur");

if($mysqli->connect_errno){
  echo 'error';
} else{

  if($mysqli->query("UPDATE user set token='".$_POST["token"]."' WHERE login='".$_POST["user"]."'") === true){
    if ($result = $mysqli->query("SELECT id FROM user where login='".$_POST["user"]."'")) {
      /* fetch associative array */
      while ($row = $result->fetch_assoc()) {
          echo $row["id"];
      }
      /* free result set */
      $result->free();
  }
  } else{
    echo 'error';
  }
}
?>
