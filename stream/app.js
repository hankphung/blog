
function openStream(cb) {
  navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: "environment" } })
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
}

openStream(function (stream) {
  playVideo(stream, 'localStream')
  const p = new SimplePeer({ initiator: HOST, trickle: false, stream });

  p.on('signal', token => {
    $('#txtMySignal').val(JSON.stringify(token))
  });

  $('#btnConnect').click(() => {
    const friendSignal = JSON.parse($('#txtFriendSignal').val());
    console.log(friendSignal)
    p.signal(friendSignal);
  });

  p.on('stream', friendStream => playVideo(friendStream, 'friendStream'));
});


function videoFullScreen() {
  var elem = document.getElementById("localStream");
  openFullscreen(elem);
}

function pageFullScreen() {
  var elem = document.documentElement;
  openFullscreen(elem);
}

/* View in fullscreen */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}
