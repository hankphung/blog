
function openStream(cb) {
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
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
    if(HOST)
        const p = new SimplePeer({ initiator: true, trickle: false });
    else {
        const p = new SimplePeer({ initiator: false, trickle: false, stream });
    }
    p.on('signal', token => {
      $('#txtMySignal').val(JSON.stringify(token))
    });
  
    $('#btnConnect').click(() => {
      const friendSignal = JSON.parse($('#txtFriendSignal').val());
      console.log(friendSignal)
      p.signal(friendSignal);
    });
    if(HOST){
        p.on('stream', friendStream => playVideo(friendStream, 'friendStream'));
    }
  });
  
  
  