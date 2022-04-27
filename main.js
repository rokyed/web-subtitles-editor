window.videoPlayer = new PlayerJS({
  video: document.querySelector('video'),
  timestamp: document.querySelector('#timestamp')
});

window.subtitleManager = new SubtitleManager({
  player: window.videoPlayer,
  subtitleElement: document.querySelector('#titlebar'),
  listElement: document.querySelector('#tableRefPoint')
});

window.converters = {
  json: new JSONConverter(),
  subrip: new SubRipConverter()
};

window.videoPlayer.addListener('timestamp.update', window.subtitleManager.updateUI, window.subtitleManager);


function setVideo(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  videoPlayer.open(file);
}

async function setSubtitles(e) {
  var file = e.target.files[0];
  let converter = null;

  for (let k in window.converters) {
    if (window.converters[k].getMimeType() == file.type) {
      converter = window.converters[k];
    }
  }

  if (!converter) {
    alert('no converted for this type of file')
    return;
  }

  let converted = await converter.getData(e.target.files[0]);



  window.subtitleManager.load(converted);
}


document.getElementById('videoinput')
  .addEventListener('change', setVideo, false);

document.getElementById('subtitlefileinput')
  .addEventListener('change', setSubtitles, false);


window.addEventListener('keydown', (e) => {
  if (e.ctrlKey) {
    let seekAmount = 0.05;

    if (e.shiftKey) {
      seekAmount = 0.5;
    }

    switch (e.code) {
      case 'ArrowLeft':
        window.videoPlayer.seekLeft(seekAmount);
        break;
      case 'ArrowRight':
        window.videoPlayer.seekRight(seekAmount);
        break;
      case 'Space':
        window.videoPlayer.togglePlay();
        break;
    }
  } else if (e.altKey) {

    switch (e.code) {
        case 'KeyX':
          document.activeElement.value = window.videoPlayer.getCurrentTime();
          document.activeElement.dispatchEvent(new Event('change'));
          break;
    }
  }
});
