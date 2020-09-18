document.getElementById("left").addEventListener('touchstart', function(){
  if(player_number == 1){
    p1_position.direction = 'left';
    document.getElementById("left").style.color = "blue";
    socket.emit('send_move', {number: player_number, pos: p1_position});
  }
  else{
    p2_position.direction = 'left';
    document.getElementById("left").style.color = "red";
    socket.emit('send_move', {number: player_number, pos: p2_position});
  }
});

document.getElementById("right").addEventListener('touchstart', function(){
  if(player_number == 1){
    p1_position.direction = 'right';
    document.getElementById("right").style.color = "blue";
    socket.emit('send_move', {number: player_number, pos: p1_position});
  }
  else{
    p2_position.direction = 'right';
    document.getElementById("right").style.color = "red";
    socket.emit('send_move', {number: player_number, pos: p2_position});
  }
});

document.getElementById("left").addEventListener('touchend', function(){
  document.getElementById("left").style.color = "white";
  if(player_number == 1){
    p1_position.direction = 'none';
  }
  else p2_position.direction = 'none';
  socket.emit('send_move', {pseudo: pseudo, direction: 'stop_left'});
});

document.getElementById("right").addEventListener('touchend', function(){
  document.getElementById("right").style.color = "white";
  if(player_number == 1){
    p1_position.direction = 'none';
  }
  else p2_position.direction = 'none';
  socket.emit('send_move', {pseudo: pseudo, direction: 'stop_right'});
});
