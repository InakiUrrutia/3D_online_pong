export default class ClientNetwork{

  constructor(socket){
    this._socket = socket;
    this._pseudo = "default";
  }

  getSocket(){
    return this._socket;
  }

  getPseudo(){
    return this._pseudo;
  }

  setPseudo(p){
    this._pseudo = p;
  }

  start(){
    this._pseudo = prompt('Quel est votre pseudo ?');
    this._socket.emit('new-player', this._pseudo);
    document.getElementById("btnRight").style.display = "block";
    document.getElementById("btnLeft").style.display = "block";

    this._socket.on('player_number', function(n){
      player_number = n;
    });

    this._socket.on('player_pseudos', function(names){
      document.getElementById("pseudo1").innerHTML = names[0];
      document.getElementById("pseudo2").innerHTML = names[1];
    });

    this._socket.on('start_match',function(){
      if(player_number == 1){
        camera_position = {x: 20, y:7, z:0};
      }
      else camera_position = {x: -20, y:7, z:0};
      restart_ball = true;
    });

    this._socket.on('stop_match', function(){
      camera_position = {x: 0, y:6, z:-18};
      game_ready = false;
    });

    this._socket.on('update_p1_position', function(data){
      p1_position = {x:data.x, y:data.y, z:data.z, direction:data.direction};
    });

    this._socket.on('update_p2_position', function(data){
      p2_position = {x:data.x, y:data.y, z:data.z, direction:data.direction};
    });
  }

  disconnect(){
    this._socket.emit('disconnect_p'+player_number, this._pseudo);
  }
}
