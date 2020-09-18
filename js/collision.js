var boundingBox;
var p1size, p2size, ballsize;

function collisionP1(sphere, p1){
  if( (collisionX1(sphere, p1) && collisionZ1(sphere, p1)) ){
    return true;
  }
  else return false;
}

function collisionP2(sphere, p2){
  if( (collisionX2(sphere, p2) && collisionZ2(sphere, p2)) ){
    return true;
  }
  else return false;
}

function collisionX1(sphere, p1){
  if( sphere.position.x + sphere.children[0].geometry.parameters.radius + 0.05 > p1.position.x - p1.children[0].geometry.parameters.width/2 ){
    return true;
  }
  else return false;
}
function collisionZ1(sphere, p1){
  if((sphere.position.z - sphere.children[0].geometry.parameters.radius < p1.position.z + p1.children[0].geometry.parameters.depth/2) && ( sphere.position.z + sphere.children[0].geometry.parameters.radius > p1.position.z - p1.children[0].geometry.parameters.depth/2)){
    return true;
  }
  else return false;
}

function collisionX2(sphere, p2){
  if( sphere.position.x - sphere.children[0].geometry.parameters.radius - 0.05 < p2.position.x + p2.children[0].geometry.parameters.width/2 ){
    return true;
  }
  else return false;
}
function collisionZ2(sphere, p2){
  if((sphere.position.z - sphere.children[0].geometry.parameters.radius < p2.position.z + p2.children[0].geometry.parameters.depth/2) && ( sphere.position.z + sphere.children[0].geometry.parameters.radius > p2.position.z - p2.children[0].geometry.parameters.depth/2)){
    return true;
  }
  else return false;
}

function sideCollision(sphere){
  if(sphere.position.z + sphere.children[0].geometry.parameters.radius > 10 || sphere.position.z - sphere.children[0].geometry.parameters.radius < -10){
    return true;
  }
  else return false;
}

export{collisionP1, collisionP2, sideCollision};
