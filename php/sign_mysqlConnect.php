<?php

  $serverName = 'localhost';
  $userName = 'root';
  $password = 'root';
  $data;

  if(isset($_POST["login"]) && isset($_POST["password"]) && isset($_POST["mail"])){
      // make connexion
      $req = mysql_connect($serverName, $userName, $password, "laby");
      if (!$req) {
          echo ('error' .mysql_error());
          exit();
      } else{
          $query = "SELECT * FROM user WHERE login='".$_POST['login']."' OR mail='".$_POST['mail']."'";
          if($result = $req->query($query)){
            $res = $result->num_rows;
            if($res == 0){
              if($req->query("INSERT INTO user (login, password, mail) VALUES ('".$_POST['login']."','".$_POST["password"]."','".$_POST['mail']."')") === true){
                echo "success";
              } else{
                echo "error";
              //  echo ('error' .mysql_error());
              }
            } else{
              echo "user exist";
            }
          }
      }
      // end the connexion after
      mysql_close($req);

  } else{
    echo "credentials";
  }
?>
