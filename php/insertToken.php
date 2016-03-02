<?php
$user = 'root';
$password = 'root';

$req = mysql_connect('localhost',$user,$password, 'laby') or die("erreur de connexion au serveur");

if(!$req){
  echo ('error' .mysql_error);
} else{

  if($req->query("UPDATE user set token='".$_POST["token"]."' WHERE login='".$_POST["user"]."'") === true){
    if ($result = $req->query("SELECT id FROM user where login='".$_POST["user"]."'")) {
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
