var oldPosX;
var oldPosY;




function createMaze(){
  // test with 4 x 4 first
  var caseMaze = 4*4;


  // new array
  var mazeArr = new Array();
  for(var i = 0 ; i < 4; i++){
    for(var j =0 ; j < 4; j++){
      mazeArr[i].push({north: true, south: true, east : true, west : true, vis : false});
    }
  }

  // begin at 0;

}

function checkCell(array, x, y){
  // first check at 0 on x

  oldPosX = x;
  oldPosY = y;

  if(x == 0 && y == 0){
    if(!array[x+1][y].vis){
      array[x][y].vis = true;
      array[x][y].east = false;
      array[x+1][y].west = false;
      x+=1;

      oldPos
      checkCell(array, x, y);
    }
  }


}


function getNeigh(arr, x, y){

  var neighbour = new Array();

  if(arr[x+1][y] != undefined){
    neighbour.push(arr[x+1][y]);
  }
  else if(arr[x-1][y] != undefined){
    neighbour.push(arr[x+1][y]);
  }
  else if(arr[x][y+1] != undefined){
    neighbour.push(arr[x][y+1]);
  }
  else if(arr[x][y-1] != undefined){
    neighbour.push(arr[x][y-1]);
  }


  return neighbour;
}
