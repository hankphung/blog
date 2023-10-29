const startbtn = document.getElementById('create_room');

const socket = io({
  autoConnect: false
});
var room = '';
var my_signal = '';

function is_with_video(){
  if( 1)
  return { facingMode: "environment" }
  else
  return false
}
function is_with_audio(){
  if(1)
    return true
  else
    return false
}

function openStream(cb) {
  navigator.mediaDevices.getUserMedia({ audio: is_with_audio(), video: is_with_video()})
    .then(stream => {
      cb(stream);
    })
    .catch(err => console.log(err));
}

function playVideo(stream, idVideo) {
  const video = document.getElementById(idVideo);
  video.srcObject = stream;
  video.onloadedmetadata = function () {
    video.play();
  };
  video.volume = 0
}
/**
 * client init
 * client join
 */
openStream(function (stream) {
  playVideo(stream, 'str1v');
  // step 1 new p2p connection
  const p = new SimplePeer({ initiator: true, trickle: false, stream });

  // client connect and share room name
  socket.on('connect', function () {
    room = genRanHex(5);
    socket.emit('join', room);
    $('#room_name').html('room: ' + room)
  });

  // when client get signal from the SP, answering to the host.
  p.on('signal', token => {
    my_signal = JSON.stringify(token);
    socket.connect();

  });
  // initalize the socket connection
  // client see the host joined, send the signal
  socket.on('new_participant', () => {
    socket.emit('offer', my_signal, room);
  })

  socket.on('answer', host_answer => {
    console.log('Received answer from host, feed the SP');
    p.signal(host_answer);
  })
});

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

function createRoom() {
  var length = 5
  var prefix = ''
  if(is_with_audio())
  prefix+='a'
  if(is_with_video())
  prefix+='v'
  const name = genRanHex((length - prefix.length));
  return name
}
