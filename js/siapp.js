import Axis from '../objects/axis.js';
import Grid from '../objects/grid.js';
import Cube from '../objects/cube.js';
import Sphere from '../objects/sphere.js';
import {collisionP1, collisionP2, sideCollision} from'./collision.js';

import Color from './color.js';

import ClientNetwork from './clientNetwork.js';

let container, w, h, scene, camera, controls, renderer, stats, light;
let loop = {};
let color;
let axis, grid, ball, p1, p2;
let custom_group = new THREE.Group();

let ball_speed = 0.05, ball_lateral_speed = 0.0;

let keyboard = new THREEx.KeyboardState();

let socket = io();
let clientNet = new ClientNetwork(socket);
let pseudo;

window.addEventListener('load', go);
window.addEventListener('resize', resize);

function go() {
  console.log("Go!");
  clientNet.start();
  window.addEventListener('beforeunload', function (){
    clientNet.disconnect();
  });
  init();
  gameLoop();
}

function init() {
  container = document.querySelector('#SIApp');
  w = container.clientWidth;
  h = container.clientHeight;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, w/h, 0.001, 100);
  camera.position.set(0, 8, -20);

  controls = new THREE.OrbitControls(camera, container, container);
  controls.target = new THREE.Vector3(0, 0, 0);
  controls.panSpeed = 0.3;

  const renderConfig = {antialias: true, alpha: true};
  renderer = new THREE.WebGLRenderer(renderConfig);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(w, h);
  //renderer.sortObjects = false;
  container.appendChild(renderer.domElement);

  // add Stats.js - https://github.com/mrdoob/stats.js
  stats = new Stats();
  stats.domElement.style.position	= 'absolute';
  stats.domElement.style.bottom	= '0px';
  stats.domElement.style.right = '0px';
  document.body.appendChild( stats.domElement );

  light = new THREE.DirectionalLight( 0xFFFFFF, 0.8 );
  light.position.set( 10,10,0 ).normalize();
  scene.add(light);
  light = new THREE.DirectionalLight( 0xFFFFFF, 0.8 );
  light.position.set( -10,10,0 ).normalize();
  scene.add(light);

  scene.add(custom_group);

  axis = new Axis();
  scene.add(axis.object);

  grid = new Grid();
  scene.add(grid.object);

  color = new Color(200, 150, 0);
  ball = new Sphere(0.4, 20, 20, color.getStringColor(), 1.0);
  color = new Color(0, 0, 200);
  p1 = new Cube(0.4, 1, 6, color.getStringColor(), 1.0);
  p1.object.position.x = 10;
  color = new Color(200, 0, 0);
  p2 = new Cube(0.4, 1, 6, color.getStringColor(), 1.0);
  p2.object.position.x = -10;
  custom_group.add(ball.object, p1.object, p2.object);

  const fps  = 60;
  const slow = 1; // slow motion! 1: normal speed, 2: half speed...
  loop.dt       = 0,
  loop.now      = timestamp();
  loop.last     = loop.now;
  loop.fps      = fps;
  loop.step     = 1/loop.fps;
  loop.slow     = slow;
  loop.slowStep = loop.slow * loop.step;

}

function gameLoop() {

  // gestion de l'incrément du temps
  loop.now = timestamp();
  loop.dt = loop.dt + Math.min(1, (loop.now - loop.last) / 1000);
  while(loop.dt > loop.slowStep) {
    loop.dt = loop.dt - loop.slowStep;
    update(loop.step); // déplace les objets d'une fraction de seconde
  }
  renderer.render(scene, camera);  // rendu de la scène
  loop.last = loop.now;

  requestAnimationFrame(gameLoop); // relance la boucle du jeu

  controls.update();
  stats.update();
}

function update(step) {

  if(start_match){
    camera.position.set(camera_position.x, camera_position.y, camera_position.z);
    startMatch();
    start_match = false;
  }
  if(game_ready){
    if(collisionP1(ball.object, p1.object)){
      ball_speed = -ball_speed;
      //ball_lateral_speed = (ball.object.position.z - p1.object.position.z)/ (p1.object.children[0].geometry.parameters.depth*4.0);
    }
    if(collisionP2(ball.object, p2.object)){
      ball_speed = -ball_speed;
      //ball_lateral_speed = (ball.object.position.z - p2.object.position.z)/ (p2.object.children[0].geometry.parameters.depth*4.0);
    }
    /*if(sideCollision(ball.object)){
      ball_lateral_speed = -ball_lateral_speed
    }*/
    ball.object.position.x += ball_speed;
    //ball.object.position.z += ball_lateral_speed;
    movement();
    updatePositions();
    score();
  }
  if(restart_ball){
    resetBall();
    game_ready = true;
  }

}

function resize() {
  w = container.clientWidth;
  h = container.clientHeight;
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

function timestamp() {
  return window.performance.now();
}

function startMatch(){
  resetBall();
  ball_speed = 0.05;
  game_ready = true;
}

function resetBall(){
  ball.object.position.x = 0;
  ball.object.position.y = 0;
  ball.object.position.z = 0;
  restart_ball = false;
  ball_lateral_speed = 0.0;
}

function score(){
  if(ball.object.position.x > 11){
    console.log('Rouge a marqué');
    restart_ball = true;
  }
  if(ball.object.position.x < -11){
    console.log('Bleu a marqué');
    restart_ball = true;
  }
}

function movement(){

  if(keyboard.pressed("Q")){
    if(player_number == 1){
      p1_position.direction = 'left';
      document.getElementById("left").style.color = "blue";
      clientNet.getSocket().emit('send_move', {number: player_number, pos: p1_position});
    }
    else{
      p2_position.direction = 'left';
      document.getElementById("left").style.color = "red";
      clientNet.getSocket().emit('send_move', {number: player_number, pos: p2_position});
    }
  }
  else{
    if(!keyboard.pressed("D")){
      document.getElementById("left").style.color = "white";
      if(player_number == 1){
        p1_position.direction = 'none';
        clientNet.getSocket().emit('send_move', {number: player_number, pos: p1_position});
      }
      else{
        p2_position.direction = 'none';
        clientNet.getSocket().emit('send_move', {number: player_number, pos: p2_position});
      }
    }
  }

  if(keyboard.pressed("D")){
    if(player_number == 1){
      p1_position.direction = 'right';
      document.getElementById("right").style.color = "blue";
      clientNet.getSocket().emit('send_move', {number: player_number, pos: p1_position});
    }
    else{
      p2_position.direction = 'right';
      document.getElementById("right").style.color = "red";
      clientNet.getSocket().emit('send_move', {number: player_number, pos: p2_position});
    }
  }
  else{
    if(!keyboard.pressed("Q")){
      document.getElementById("right").style.color = "white";
      if(player_number == 1){
        p1_position.direction = 'none';
        clientNet.getSocket().emit('send_move', {number: player_number, pos: p1_position});
      }
      else{
        p2_position.direction = 'none';
        clientNet.getSocket().emit('send_move', {number: player_number, pos: p2_position});
      }
    }
  }
  /*document.body.addEventListener('keyup', function(event){
    if(event.key == 'q' || event.key == 'Q'){
      document.getElementById("left").style.color = "white";
      if(player_number == 1){
        p1_position.direction = 'none';
      }
      else p2_position.direction = 'none';
      clientNet.getSocket().emit('send_move', {pseudo: pseudo, direction: 'stop_left'});
    }
    if(event.key == 'd' || event.key == 'D'){
      document.getElementById("right").style.color = "white";
      if(player_number == 1){
        p1_position.direction = 'none';
      }
      else p2_position.direction = 'none';
      clientNet.getSocket().emit('send_move', {pseudo: pseudo, direction: 'stop_right'});
    }
  });*/
}

function updatePositions(){
  if(p1_position.direction == 'left'){
    p1_moveLeft(p1.object);
  }
  if(p1_position.direction == 'right'){
    p1_moveRight(p1.object);
  }
  if(p2_position.direction == 'left'){
    p2_moveRight(p2.object);
  }
  if(p2_position.direction == 'right'){
    p2_moveLeft(p2.object);
  }
}
