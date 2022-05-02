window.snapInsert = {
  start: null,
  ready: false
};

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
    let mime = window.converters[k].getMimeType();
    let suffix = window.converters[k].getFileType();

    if (mime == file.type) {
      converter = window.converters[k];
    } else if (suffix.length > 0 && file.name.indexOf(suffix) == file.name.length - suffix.length) {
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
  // e.stopPropagation();
  let actel = document.activeElement;

  if (e.ctrlKey) {
    e.preventDefault();

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
    e.preventDefault();

    let snaps = window.subtitleManager.getSnaps();

    switch (e.code) {
        case 'KeyH':
          alert(`
Ctrl+Z: Undo
Ctrl+Left Arrow: seeking left
Ctrl+Right Arrow: seeking right
Ctrl+Shift+Left Arrow: seeking left fast
Ctrl+Shift+Right Arrow: seeking right fast
Alt+D: Set video time to selected subtitle start
Alt+F: Set video time to selected subtitle end
Alt+Z: Set start of subtitle to current video time
Alt+X: Set end of subtitle to current video time
Alt+C: Create new subtitle
Alt+N: Set start time of future subtitle
Alt+M: Create new subtitle with start time from Alt+N and current time.
Alt+W: Set current time as text.
          `)
          break;
        case 'KeyD':
          snaps.map((s) => {
            if (s.contains(actel)) {
              window.videoPlayer.setCurrentTime(s.ref.start);
            }
          })
          break;
        case 'KeyF':
          snaps.map((s) => {
            if (s.contains(actel)) {
              window.videoPlayer.setCurrentTime(s.ref.end);
            }
          })
          break;
        case 'KeyZ':
          snaps.map((s) => {
            if (s.contains(actel)) {
              s.ref.start = window.videoPlayer.getCurrentTime();
              s.refresh();
              console.log(s);
            }
          })
          break;
        case 'KeyX':
          snaps.map((s) => {
            if (s.contains(actel)) {
              s.ref.end = window.videoPlayer.getCurrentTime();
              s.refresh();
              console.log(s);
            }
          })
          break;
        case 'KeyN':
          window.snapInsert.start = window.videoPlayer.getCurrentTime();
          window.snapInsert.ready = true;
          break;
        case 'KeyM':
          if (window.snapInsert.ready === true) {
            window.subtitleManager.addSubtitle({
              startTime: window.snapInsert.start,
              endTime: window.videoPlayer.getCurrentTime()
            });
            window.snapInsert.start = null;
            window.snapInsert.ready = false;
          }
          break;
        case 'KeyW':
          document.activeElement.value = window.videoPlayer.getCurrentTime();
          document.activeElement.dispatchEvent(new Event('change'));
          break;
        case 'KeyC':
          window.subtitleManager.addSubtitle({
            startTime: window.videoPlayer.getCurrentTime()
          });
          break;
    }
  }
});

initializeSubtitleManagerAutosave();
