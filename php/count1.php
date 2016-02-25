<?php
// Deuxième version (comme le jeu n'existe pas encore l'incrémentation se fait lorsque le visiteur se log)
session_start();
$_SESSION['login'] = $_POST['login'];
$_SESSION['password'] = $_POST['password'];
$mysqli = new mysqli('localhost',$user,$password, 'laby') or die("erreur de connexion au serveur");
if($mysqli->connect_errno){
  echo 'error';
} else{
  $query = $mysqli->query("UPDATE laby SET nom_champ = nom_champ + 1 WHERE login='".$_POST["login"]."' AND password='".$_POST["password"]."'");
$mysqli_close();
header('Location: index.html');
?>