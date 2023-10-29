const startbtn = document.getElementById('join_room');

const socket = io({
  autoConnect: false
})
var room = '';
var my_signal = '';

// host to join room
$(startbtn).click(function () {
  room = prompt('Enter a room name:');
  socket.emit('join', room);
  $('.participant.pending').attr({id: room});
  $('.participant.pending .participant-name').html('room: ' +room);
})

function openStream(cb) {
  navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } })
    .then(stream => {
      cb(stream);
    })
    .catch(err => console.log(err));
}

function playVideo(stream, idVideo) {
  // only host play friend stream
  const video = document.getElementById(idVideo);
  video.srcObject = stream;
  video.onloadedmetadata = function () {
    video.play();
  };
}
let blank_canvas = document.getElementById('blank');

const blank_stream = blank_canvas.captureStream();

const p = new SimplePeer({ initiator: false, trickle: false, blank_stream });

// when client get signal from the SP, answering to the host.
p.on('signal', token => {
  my_signal = JSON.stringify(token);
  socket.emit('answer', my_signal, room)
});
// host connected to the room, activate the join button.
socket.on('connect', function () {
  startbtn.disabled = false
});
// initalize the socket connection
socket.connect();

// client just offer
socket.on('offer', client_offer => {
  console.log('Received offer from client');
  // const friendSignal = JSON.parse(offer);
  // give the signal to SP
  p.signal(client_offer);
  $('#qr').hide()
  console.log(my_signal)
  // Use the offer to create an answer and send it back to the server
});
// when receiving stream from remote
p.on('stream', friendStream => {
  console.log('received stream')
  playVideo(friendStream, 'str2v');
});

openStream(function (stream) {
  playVideo(stream, 'str1v')
  // step 1 new p2p connection
});

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

const participant = $('.participant')[0]
var participants = $('.participant')

class VideoRenderer {
  constructor(video, canvas) {
    this.video = video;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.requestId = null;
  }

  render() {
    const { video, canvas, ctx } = this;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // Draw the video frame onto the canvas
      let height = participant.clientHeight
      canvas.width = height * (video.videoWidth/ video.videoHeight);
      canvas.height = height;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    // Schedule the next frame
    this.requestId = requestAnimationFrame(this.render.bind(this));
  }

  start() {
    // Start rendering frames
    this.render();
  }

  stop() {
    // Stop rendering frames
    cancelAnimationFrame(this.requestId);
  }
}

for(var i=0; i< participants.length; i++){
  let canvas = participants[i].children[0];
  let id = participants[i].dataset.for
  $(participants[i]).find('.overlay').click(function(){
    $('#'+id)[0].checked=true
  })
  let video =  document.getElementById(id + 'v');
  let renderer = new VideoRenderer(video,canvas);
  renderer.start()
}
document.onkeyup = function(e){
  let vcontrainer = document.getElementById('video-container');
  if(e.key.toString() == '3'){
    vcontrainer.classList.add('sbs')
  } else if (e.key.toString() == '1'){
    vcontrainer.classList.remove('sbs')
    $('#str'+e.key)[0].checked = true
  }
}