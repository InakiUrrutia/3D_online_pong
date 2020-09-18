let geometry, material, obj;

export default class Sphere{
  constructor(r, wS, hS, color, opa){
    this.object = new THREE.Group();
    if (typeof r !== 'number') {
      throw new Error('parameter R of Sphere is not a number');
    }
    if (r < 0){
      throw new Error('parameter R of Sphere must be higher than 0');
    }
    if (typeof wS !== 'number') {
      throw new Error('parameter WS of Sphere is not a number');
    }
    if (wS < 0){
      throw new Error('parameter WS of Sphere must be higher than 0');
    }
    if (typeof hS !== 'number') {
      throw new Error('parameter HS of Sphere is not a number');
    }
    if (hS < 0){
      throw new Error('parameter HS of Sphere must be higher than 0');
    }
    geometry = new THREE.SphereBufferGeometry(r, wS, hS);
    material = new THREE.MeshPhongMaterial({color: color, transparent: true, opacity: opa}); // Color
    obj = new THREE.Mesh(geometry, material);

    this.object.add(obj);
  }
}
