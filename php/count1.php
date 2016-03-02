<?php
// Deuxième version (comme le jeu n'existe pas encore l'incrémentation se fait lorsque le visiteur se log)
session_start();
$_SESSION['login'] = $_POST['login'];
$_SESSION['password'] = $_POST['password'];

$req = mysql_connect('localhost',$user,$password, 'laby') or die("erreur de connexion au serveur");
if(!$req){
  echo ('error' .mysql_error);
} else{
  $query = $req->query("UPDATE laby SET nom_champ = nom_champ + 1 WHERE login='".$_POST["login"]."'");
mysql_close($req);
header('Location: index.html');
?>
