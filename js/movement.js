function p1_moveLeft(object){
  if((object.position.z + object.children[0].geometry.parameters.depth/2.0) < 10){
    object.position.z += 0.1;
  }
}
function p1_moveRight(object){
  if((object.position.z - object.children[0].geometry.parameters.depth/2.0) > -10){
    object.position.z -= 0.1;
  }
}
function p2_moveLeft(object){
  if((object.position.z + object.children[0].geometry.parameters.depth/2.0) < 10){
    object.position.z += 0.1;
  }
}
function p2_moveRight(object){
  if((object.position.z - object.children[0].geometry.parameters.depth/2.0) > -10){
    object.position.z -= 0.1;
  }
}
