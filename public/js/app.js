window.addEventListener('load', () => {
  // Put all client-side code here
});


// Local Video
var localVideoEl = document.getElementById('local-video');
// Room var
var roomName = "myRoomTest";
// Counter to know the number of remote video
var counterVideo = 0;
// Var used to know the actual video in fullscreen
var actualFullScreen;


// create our WebRTC connection
var webrtc = new SimpleWebRTC({
  // the id/element dom element that will hold "our" video
  localVideoEl: 'local-video',
  // the id/element dom element that will hold remote videos
  //remoteVideosEl: 'remote-videos',
  remoteVideosEl: '',
  // immediately ask for camera access
  autoRequestMedia: true,

  media: {
        audio: false,
        video: true
        /*video: {
            mandatory: {
                maxWidth: 320,
                maxHeight: 180,
                maxFrameRate: 15
           }
         }*/
  }
});

// a peer video has been added
webrtc.on('videoAdded', function (video, peer) {
    console.log('video added', peer);
    if(counterVideo == 0){
      var remotes = document.getElementById('remote-videos');
      actualFullScreenId =  webrtc.getDomId(peer);
    }else{
      var remotes = document.getElementById('remote-list-videos');
    }
    if (remotes) {
        console.log(video);
        //Create the container for the video
        var container = document.createElement('div');
        container.className = 'videoContainer';
        container.id = 'container_' + webrtc.getDomId(peer);
        container.appendChild(video);
        //Swap video on click
        container.onclick = doSwap;
        // suppress contextmenu
        video.oncontextmenu = function () { return false; };
        // save the actual fullscreen
        if(counterVideo == 0){
          actualFullScreen = container;
        }
        remotes.appendChild(container);
        //console.log(listPeer);
        counterVideo++;
    }
});

// a peer video was removed
webrtc.on('videoRemoved', function (video, peer) {
    console.log('video removed ', peer);
    var el = document.getElementById(peer ? 'container_' + webrtc.getDomId(peer) : 'localScreenContainer');
    var remotes = el.parentNode;
    if (remotes && el) {
      remotes.removeChild(el);
      counterVideo--;
    }
});

// Join room to create peer
webrtc.on('readyToCall', function () {
      console.log("Join" + roomName);
      webrtc.joinRoom(roomName);
});


// This function call the swapVideo with the good param
function doSwap(){
  //Verify this is not actual fullScreen
  if(this !== actualFullScreen){
    swapVideo(actualFullScreen,this);
  }else{
    console.log("Can't change screen already in fullscreen");
  }
}

// This function is used to display a remote video in the list to fullscreen
// and put the previous fullscreen video to the list
function swapVideo(fullScreen, remote){
  console.log("Swapping video");
  //Get list of peer
  var listPeer = webrtc.getPeers();
  //Remove all StreamVideo
  for(var i = listPeer.length; i >= 0; i--){
    if(listPeer[i] != null){
      webrtc.handlePeerStreamRemoved(listPeer[i]);
    }
  }
  var index;
  //Add first video (clicked in the miniature)
  for(var i = 0; i < listPeer.length; i++){
    var remoteContainerId = "container_" + listPeer[i].id + "_video_incoming";
    if(remote.id === remoteContainerId){
      webrtc.handlePeerStreamAdded(listPeer[i]);
      index = i;
    }
  }
  //Add all remote videos
  for(var i = 0; i < listPeer.length; i++){
    console.log("i: " + i + " index: " + index);
    if(i != index){
      console.log("add all peer");
      webrtc.handlePeerStreamAdded(listPeer[i]);
    }
  }

}

function test(){
  //var mytest = webrtc.getPeers('video');
  //webrtc.handlePeerStreamRemoved(listPeer[0]);
  //var mytest = webrtc.handlePeerStreamAdded(listPeer[0]);
  //console.log(mytest);
  /*console.log("test" + session);
  var mytest = webrtc.getPeers('video');
  var mytest2 = webrtc.getPeers(session);
  var mytest3 = webrtc.getPeers();
  console.log(mytest);
  console.log(mytest2);
  console.log(mytest3[0]);
  console.log(mytest3[1]);
  var req = document.getElementById('remote-videos');
  console.log(req);
  console.log(req.childNodes[1].id);*/

}
