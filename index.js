var PORT = process.env.PORT || 5000;
var express = require('express');
var app = express();

var http = require('http');
var server = http.Server(app);

var nb_joueurs = 0;
var joueurs = ['none', 'none'];

app.use(express.static('./'));
app.use(express.static('client'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + "/js"));
app.use(express.static(__dirname + "/lib"));
app.use(express.static(__dirname + "/objects"));

server.listen(PORT, function() {
  console.log('3D Pong running on port 5000');
});

var io = require('socket.io')(server);

io.on('connection', function(socket, pseudo) {
  socket.join('game');
  socket.on('new-player', function(pseudo) {
    socket.pseudo = pseudo;
    if(joueurs[0] == 'none'){
      joueurs[0] = pseudo;
      socket.emit('player_number', 1);
    }
    else if(joueurs[1] == 'none'){
      joueurs[1] = pseudo;
      socket.emit('player_number', 2);
    }
    nb_joueurs++;
    console.log(nb_joueurs + " connectés");
    console.log(joueurs);
    if(nb_joueurs == 2){
      io.in('game').emit('player_pseudos', joueurs);
      io.in('game').emit('start_match','void');
    }
  });

  socket.on('disconnect_p1', function(pseudo){
    nb_joueurs--;
    console.log(nb_joueurs + " connectés");
    joueurs[0] = 'none';
    console.log(joueurs);
    io.in('game').emit('stop_match','void');
  });
  socket.on('disconnect_p2', function(pseudo){
    nb_joueurs--;
    console.log(nb_joueurs + " connectés");
    joueurs[1] = 'none';
    console.log(joueurs);
    io.in('game').emit('stop_match','void');
  });

  socket.on('send_move', function(data){
    if(data.number == 1){
      if(data.pos.direction == 'left'){
        if(data.pos.z < 7.0){
          data.pos.z += 0.1;
        }
      }
      if(data.pos.direction == 'right'){
        if(data.pos.z > -7.0){
          data.pos.z -= 0.1;
        }
      }
      io.in('game').emit('update_p1_position', data.pos);
    }
    if(data.number == 2){
      if(data.pos.direction == 'left'){
        if(data.pos.z > -7.0){
          data.pos.z -= 0.1;
        }
      }
      if(data.pos.direction == 'right'){
        if(data.pos.z < 7.0){
          data.pos.z += 0.1;
        }
      }
      io.in('game').emit('update_p2_position', data.pos);
    }
  });
});
