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
window.speechAdapters = {
  openai: new OpenAIWhisperAdapter(),
  otter: new OtterAIAdapter()
};
window.currentSpeechService = 'openai';
const HELP_TEXT = `
  <li><span class="command">Ctrl+Z</span>: Undo</li>
  <li><span class="command">Ctrl+Left Arrow</span>: seeking left</li>
  <li><span class="command">Ctrl+Right Arrow</span>: seeking right</li>
  <li><span class="command">Ctrl+Shift+Left Arrow</span>: seeking left fast</li>
  <li><span class="command">Ctrl+Shift+Right Arrow</span>: seeking right fast</li>
  <li><span class="command">Alt+D</span>: Set video time to selected subtitle start</li>
  <li><span class="command">Alt+F</span>: Set video time to selected subtitle end</li>
  <li><span class="command">Alt+Z</span>: Set start of subtitle to current video time</li>
  <li><span class="command">Alt+X</span>: Set end of subtitle to current video time</li>
  <li><span class="command">Alt+C</span>: Create new subtitle</li>
  <li><span class="command">Alt+N</span>: Set start time of future subtitle</li>
  <li><span class="command">Alt+M</span>: Create new subtitle with start time from Alt+N and current time.</li>
  <li><span class="command">Alt+W</span>: Set current time as text.</li>
`;
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

async function recordSegment(durationSec = 5) {
  return new Promise((resolve) => {
    const stream = window.videoPlayer.cfg.video.captureStream();
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    const chunks = [];
    mediaRecorder.ondataavailable = (ev) => chunks.push(ev.data);
    mediaRecorder.onstop = () => {
      resolve(new Blob(chunks, { type: 'audio/webm' }));
    };
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), durationSec * 1000);
  });
}

async function transcribeCurrentSegment(adapterName = 'openai') {
  const duration = 5;
  const startSec = window.videoPlayer.cfg.video.currentTime;
  window.videoPlayer.play();
  const audioBlob = await recordSegment(duration);
  window.videoPlayer.pause();
  try {
    const adapter = window.speechAdapters[adapterName];
    if (!adapter) {
      throw new Error('Unknown speech adapter: ' + adapterName);
    }
    const text = await adapter.transcribe(audioBlob);
    window.subtitleManager.addSubtitle({
      startTime: Utils.convertSecondsToStringTimestamp(startSec),
      endTime: Utils.convertSecondsToStringTimestamp(startSec + duration),
      content: [text]
    });
  } catch (e) {
    alert(e.message);
  }
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
document.getElementById('addsubtitle')
  .addEventListener('click', (e) => {
    window.subtitleManager.addSubtitle({
      startTime: window.videoPlayer.getCurrentTime()
    });
  });
document.getElementById('openaiKey').addEventListener('change', (e) => {
  window.speechAdapters.openai.setApiKey(e.target.value);
});
document.getElementById('transcribeBtn').addEventListener('click', () => {
  transcribeCurrentSegment(window.currentSpeechService);
});
document.getElementById('otterKey').addEventListener('change', (e) => {
  window.speechAdapters.otter.setApiKey(e.target.value);
});
document.getElementById('transcriptionService').addEventListener('change', (e) => {
  window.currentSpeechService = e.target.value;
});
document.getElementById('helpDrawer').querySelector('.help-text').innerHTML = HELP_TEXT;
document.getElementById('helpBtn').addEventListener('click', () => {
  document.getElementById('helpDrawer').classList.add('open');
});
document.getElementById('closeHelp').addEventListener('click', () => {
  document.getElementById('helpDrawer').classList.remove('open');
});
document.getElementById('configBtn').addEventListener('click', () => {
  document.getElementById('configDrawer').classList.add('open');
});
document.getElementById('closeConfig').addEventListener('click', () => {
  document.getElementById('configDrawer').classList.remove('open');
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
          document.getElementById('helpDrawer').classList.add('open');
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
