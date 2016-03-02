<?php
// Première version (comme le jeu n'existe pas encore l'incrémentation se fait lorsque le visiteur se log)
$user = 'root';
$password = 'root';

$req = mysql_connect('localhost',$user,$password, 'laby') or die("erreur de connexion au serveur");
if(!$req)){
  echo ('error' .mysql_error());
} else{
  $query = $req->query("UPDATE laby SET nom_champ = nom_champ + 1 WHERE login='".$_POST["login"]."'");
  $row = $query -> num_rows;
  if($row) // Vérification du mot de passe contenu dans la BD
      {
      echo 'success';
	//  header('Location: index.html')
      }
  else
      {
      echo 'error';
  }
}
?>
