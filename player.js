class PlayerJS {
  cfg = {};
  timer = null;

  constructor(config) {
    this.cfg = config;
    this.initialize();
  }
  initialize() {
    this.cfg.video.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
    this.cfg.video.addEventListener('play', this.onPlay.bind(this));
    this.cfg.video.addEventListener('ended', this.onEnded.bind(this));
    this.cfg.video.addEventListener('pause', this.onPause.bind(this));
    setInterval(this.updateAll.bind(this), 1);
  }

  pause() {
    this.cfg.video.pause();
  }

  play() {
    this.cfg.video.play();
  }

  seekLeft() {
    this.cfg.video.currentTime -= 0.1;
  }

  seekRight() {
    this.cfg.video.currentTime += 0.1;
  }

  togglePlay() {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  isPlaying() {
    return !!(this.cfg.video.currentTime > 0 && !this.cfg.video.paused && !this.cfg.video.ended && this.cfg.video.readyState > 2);
  }

  onEnded() {

  }

  onPause() {

  }

  onPlay() {

  }

  formatTimestamp(ts) {
    let hours = Math.floor(ts / 3600);
    let r1 = ts - (hours * 3600);
    let minutes = Math.floor(r1 / 60);
    let r2 = r1 - (minutes * 60);
    let seconds = Math.floor(r2);
    let milliseconds = r2 - seconds;

    let hh = hours.toString().padStart(2,'0').substr(0,2);
    let mm = minutes.toString().padStart(2,'0').substr(0,2);
    let ss = seconds.toString().padStart(2,'0').substr(0,2);
    let ms = milliseconds.toFixed(3).split('.')[1].substr(0,3);

    return `${hh}:${mm}:${ss},${ms}`;
  }

  updateAll() {
    try {
      this.cfg.timestamp.value = this.formatTimestamp(this.cfg.video.currentTime);
    } catch (e) {
      console.warn(e);
    }
  }

  onTimeUpdate(e) {
  }
}
