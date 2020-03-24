const Reveal = require('reveal.js');
const io = require('socket.io-client');
const hljs = require('highlight.js');

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

document.getElementById('barThingy').onclick = function(e) {
  form.style.display = 'block';
}


Reveal.initialize({
  width: 1280,
  height: 720,
  margin: 0.1,
  history: true,
  //center: false,
  transition: 'fade'
});

hljs.initHighlightingOnLoad();

var stateChanged = function(event) {
  var state = Reveal.getState();
  socket.emit('state-changed', {
    state: state
  });
}

Reveal.addEventListener( 'slidechanged', stateChanged );
Reveal.addEventListener( 'fragmentshown', stateChanged );
Reveal.addEventListener( 'fragmenthidden', stateChanged );

socket.on('change-state', function(data){
  Reveal.setState(data.state);
});
