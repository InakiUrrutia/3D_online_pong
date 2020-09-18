let geometry, material;
let xaxis, yaxis, zaxis;

export default class Axis{
  constructor(){
    this.object = new THREE.Group();

    // X-Axis
    geometry = new THREE.CubeGeometry( 10, 0.1, 0.1 );
    material = new THREE.MeshBasicMaterial({color: 'rgb(0,255,0)'}); // Green color
    xaxis = new THREE.Mesh( geometry, material, );
    xaxis.position.x += 5;

    // Y-Axis
    geometry = new THREE.CubeGeometry( 0.1, 10, 0.1 );
    material = new THREE.MeshBasicMaterial({color: 'rgb(255,0,0)'}); // Red color
    yaxis = new THREE.Mesh( geometry, material, );
    yaxis.position.y += 5;

    // Z-Axis
    geometry = new THREE.CubeGeometry( 0.1, 0.1, 10 );
    material = new THREE.MeshBasicMaterial({color: 'rgb(0,0,255)'}); // Blue color
    zaxis = new THREE.Mesh( geometry, material, );
    zaxis.position.z += 5;

    this.object.add(xaxis, yaxis, zaxis);
  }
}
