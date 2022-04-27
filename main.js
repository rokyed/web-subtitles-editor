window.videoPlayer = new PlayerJS({
  video: document.querySelector('video'),
  timestamp: document.querySelector('#timestamp')

});

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  let playerSource = document.querySelector('video');
  playerSource.src = URL.createObjectURL(file);
}

document.getElementById('videoinput')
  .addEventListener('change', readSingleFile, false);


window.addEventListener('keydown', (e) => {
  if (!e.ctrlKey)
    return;

  switch (e.code) {
    case 'ArrowLeft':
      window.videoPlayer.seekLeft();
      break;
    case 'ArrowRight':
      window.videoPlayer.seekRight();
      break;
    case 'Space':
      window.videoPlayer.togglePlay();
      break;
  }
});
