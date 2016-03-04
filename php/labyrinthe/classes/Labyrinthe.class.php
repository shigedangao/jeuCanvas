<?php
class Labyrinthe {
	private $labyrinthe;
	private $taille;
	private $max;
	private $fait;
	private $taillecase;
	private $cssval = "2px solid black;";
	private $op = Array("N"=>"S","S"=>"N","E"=>"O","O"=>"E");


	function __construct($taille,$taillecase) {
		$this->taille = $taille;
		$this->taillecase = $taillecase;
		$this->labyrinthe = array_fill(0,$taille*$taille, array("N"=>-2,"S"=>-2,"E"=>-2,"O"=>-2));
		$this->fait = array_fill(0,$taille*$taille,0);
		$this->max = count($this->labyrinthe);
	}

	function bordure() {
		for ($i=0; $i<$this->taille;$i++) {
			$this->labyrinthe[$i]["N"] = -1;
			$this->labyrinthe[$this->max - $i - 1]["S"] = -1;
			$this->labyrinthe[$i*$this->taille]["O"] = -1;
			$this->labyrinthe[($i+1)*$this->taille - 1]["E"] = -1;
		}
	}

	/* calcul du déplacement */
	function indice($case,$dir) {
		$res = -1;
		switch($dir) {
			case "N":if ($case>$this->taille) $res = $case - $this->taille;
					break;
			case "S":if ($case<($this->max - $this->taille)) $res = $case + $this->taille;
					break;
			case "E":if ((($case+1) % $this->taille) != 0) $res = $case + 1;
					break;
			case "O":if (($case % $this->taille) != 0) $res = $case - 1;
					break;
		}
		return $res;
	}

	/* retourne */
	function auPif($case) {
		$casespos = array();
		foreach ($this->labyrinthe[$case] as $dir => $v) {
				$ind = $this->indice($case,$dir);
				if ($ind != -1){
					if ($this->fait[$ind] == NULL)
						$casespos[] = array($dir,$ind);
				}
		}
		if (count($casespos)>0)
			return $casespos[array_rand($casespos)];
		else
			return array();
	}

	function build() {
		$pos = 0;
		$pile = array();
		array_push($pile, 0);
		$this->fait[0] = 1;
		while (count($pile) > 0) {
			$case = array_pop($pile);
			$nouveau = true;
			while ($nouveau == true) {
				$pos = $this->auPif($case);
				if (count($pos)>0) {
					$dir = $pos[0];
					$c = $pos[1];
					$this->labyrinthe[$case][$dir] = $c;
					array_push($pile,$case);
					$case = $c;
				}
				else
					$nouveau = false;
				$this->fait[$case] = 1;

			}
		}
	}

	function finalise() {
		for ($i=0;$i<$this->max;$i++) {
			foreach ($this->labyrinthe[$i] as $dir => $c) {
				if ($c > -1)
					$this->labyrinthe[$c][$this->op[$dir]] = $i;
				//else
				//	$this->labyrinthe[$dir][$c] = -1;
			}
		}
	}

	function drawTable() {
		echo '<table style="border-collapse:collapse"><tr>';
		for($i=0;$i<$this->max;$i++) {
			if (($i % $this->taille) == 0 && $i != 0) echo "</tr>\n<tr>";
			$css = "color:white;width:".$this->taillecase."px;height:".$this->taillecase."px;";
			if (!($this->labyrinthe[$i]["N"]>=0)) $css .= "border-top:".$this->cssval;
			if (!($this->labyrinthe[$i]["S"]>=0)) $css .= "border-bottom:".$this->cssval;
			if (!($this->labyrinthe[$i]["E"]>=0)) $css .= "border-right:".$this->cssval;
			if (!($this->labyrinthe[$i]["O"]>=0)) $css .= "border-left:".$this->cssval;
			echo "<td style='$css'></td>";
		}
		echo "</tr></table>";
	}

	function drawImage() {
		header("Content-Type: image/png");
		$im = imagecreate($this->taille * $this->taillecase, $this->taille * $this->taillecase);
		$background_color = imagecolorallocate($im, 255, 255, 255);
		$lignecolor = imagecolorallocate($im, 0, 0, 0);
		for ($i=0;$i<$this->max;$i++) {
			$x = ($i % $this->taille) * $this->taillecase;
			$y = intval($i / $this->taille) * $this->taillecase;
			if (!($this->labyrinthe[$i]["O"]>=0)) imageline($im,$x,$y,$x,$y + $this->taillecase,$lignecolor);
			if (!($this->labyrinthe[$i]["S"]>=0)) imageline($im,$x,$y + $this->taillecase,$x + $this->taillecase,$y + $this->taillecase,$lignecolor);
			if (!($this->labyrinthe[$i]["E"]>=0)) imageline($im,$x + $this->taillecase,$y + $this->taillecase,$x+ $this->taillecase,$y,$lignecolor);
			if (!($this->labyrinthe[$i]["N"]>=0)) imageline($im,$x+ $this->taillecase,$y,$x,$y,$lignecolor);
		}
		imagepng($im); // construction sous forme d'une image png
		imagedestroy($im);
	}

	function getJson() {

		return json_encode($this->labyrinthe); // construire une chaîne de caractère au format json
	}

	function setJson($json) {
		$this->labyrinthe = json_decode($json);
	}

}
?>
