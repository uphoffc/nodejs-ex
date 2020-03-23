const Reveal = require('reveal.js');
const io = require('socket.io-client');

var socket = io();

var form = document.getElementById('login');
form.onsubmit = function(e) {
  e.preventDefault();
  key = document.getElementById('loginPW').value;
  socket.emit('authenticate', {
    plaintext: key
  });
  form.style.display = 'none';
};


Reveal.initialize({
  width: 1280,
  height: 720,
  margin: 0.1,
  history: true,
  //center: false,
  transition: 'fade'
});

socket.on('change-state', function(data){
  Reveal.setState(data.state);
});

var stateChanged = function(event) {
  var state = Reveal.getState();
  socket.emit('state-changed', {
    state: state
  });
}

Reveal.addEventListener( 'slidechanged', stateChanged );
Reveal.addEventListener( 'fragmentshown', stateChanged );
Reveal.addEventListener( 'fragmenthidden', stateChanged );
