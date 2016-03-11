<?php
// Première version (comme le jeu n'existe pas encore l'incrémentation se fait lorsque le visiteur se log)
 header('Access-Control-Allow-Origin: *');
$user = 'root';
$password = 'root';
$mysqli = new mysqli('localhost',$user,$password, 'laby') or die("erreur de connexion au serveur");
if($mysqli->connect_errno){
  echo 'error';
} else{

  if(isset($_POST['type'])){

    $query = $mysqli->query("UPDATE user SET win_count = win_count + 1 WHERE login='".$_POST["username"]."'");

    if($query) // Vérification du mot de passe contenu dans la BD
        {
          // nothing
        }
    else
        {
        echo 'error';
    }
  }
  $secQ = $mysqli->query("SELECT win_count FROM user WHERE login='".$_POST["username"]."'");
  $row = $secQ;
  if ($row->num_rows > 0) {
    // output data of each row
    while($res = $row->fetch_assoc()) {
        echo $res["win_count"];
    }
}
  else
        {
        echo 'error';
  }




}
?>
