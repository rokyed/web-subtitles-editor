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
  subrip: new SubRipConverter(),
  localStorage: new LocalStorageConverter()
};
window.videoPlayer.addListener('timestamp.update', window.subtitleManager.updateUI, window.subtitleManager);

async function initializeSubtitleManagerAutosave() {
  // loading autosaves
  let restoredSubtitles = await window.converters.localStorage.getData();

  if (restoredSubtitles && restoredSubtitles.list && restoredSubtitles.list.length > 0)
    window.subtitleManager.load(restoredSubtitles);

  //writing autosaves
  setInterval(function () {
    window.converters.localStorage.writeData(window.subtitleManager.getData());
  }, 15000);
}

setInterval(function () {
  // window.subtitleManager.onScroll();
}, 16);

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
  window.converters.localStorage.writeData(converted);
}


document.getElementById('videoinput')
  .addEventListener('change', setVideo, false);

document.getElementById('subtitlefileinput')
  .addEventListener('change', setSubtitles, false);

document.getElementById('savesubrip')
  .addEventListener('click', (e) => {
    window.converters.subrip.writeData(window.subtitleManager.getData());
  });
document.getElementById('savejson')
  .addEventListener('click', (e) => {
    window.converters.json.writeData(window.subtitleManager.getData());
  });
// 
// window.addEventListener('scroll', (e) => {
//   window.subtitleManager.onScroll();
// })

window.addEventListener('keydown', (e) => {
  if (e.ctrlKey) {
    let seekAmount = 0.05;

    if (e.shiftKey) {
      seekAmount = 0.5;
    }

    switch (e.code) {
      case 'KeyZ':
        window.subtitleManager.restoreSnapshot();
        break;
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
        case 'KeyC':
          window.subtitleManager.addSubtitle(window.videoPlayer.getCurrentTime());
          break;
    }
  }
});

initializeSubtitleManagerAutosave();
