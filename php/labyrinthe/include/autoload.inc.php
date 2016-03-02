<?php
	function __autoload($name)
	{
		require_once($_SERVER['DOCUMENT_ROOT'] ."/LabyM/php/labyrinthe/classes/".$name.".class.php");
	}
?>
