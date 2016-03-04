<?php
	include_once("labyrinthe/include/autoload.inc.php");
	$lab = new Labyrinthe(20,30); // taille
	$lab->bordure(); // mettre les bordures
	$lab->build(); // construction
	$lab->finalise();// finalisation
	echo $lab->getJson();
?>
