<?php

  $serverName = 'localhost';
  $userName = 'root';
  $password = 'root';


  if(isset($_POST["login"]) && isset($_POST["password"]) && isset($_POST["mail"])){
    if (filter_var($_POST["mail"], FILTER_VALIDATE_EMAIL)){
      // make connexion
      $mysqli = new mysqli($serverName, $userName, $password, "laby");
      if ($mysqli->connect_errno) {
          echo "mysql error";
          exit();
      } else{
          $query = "SELECT * FROM user WHERE login='".$_POST['login']."' OR mail='".$_POST['mail']."'";
          if($result = $mysqli->query($query)){
            $res = $result->num_rows;
            if($res == 0){
              if($mysqli->query("INSERT INTO user (login, password, mail) VALUES ('".$_POST['login']."','".$_POST['password']."','".$_POST['mail']."')") === true){
                echo "success";
              } else{
                echo "error";
                echo $mysqli->errno;
              }
            } else{
              echo "a user already exist";
            }
          }
      }

      // end the connexion after
      $mysqli->close();
    } else{
      echo "invalid mail";
    }
  }

?>
