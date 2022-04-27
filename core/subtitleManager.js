class SubtitleManager {
  cfg = {};
  data = {list:[]};
  snaps = [];
  constructor(config) {
    this.cfg = config;
  }

  load(data) {
    this.data = data;
    this.renderList();
  }

  getCurrentSubtitle(timestamp) {
    let sec = Utils.convertStringTimestampToSeconds(timestamp);
    let list = this.data.list;

    for (let i = 0; i < list.length; i++) {
      let sub = list[i];
      let start = Utils.convertStringTimestampToSeconds(sub.start);
      let end = Utils.convertStringTimestampToSeconds(sub.end);

      if (sec >= start && sec <= end) {
        return sub;
      }
    }
  }

  getIndexOfSubtitle(subtitle) {
    return this.data.list.indexOf(subtitle);
  }

  renderList() {
    for (let i =0; i< this.snaps.length; i++) {
      this.snaps[i].remove();
    }

    this.snaps = [];

    for (let i = 0; i < this.data.list.length; i++) {
      this.snaps.push(new Snap(this.cfg.listElement, this.data.list[i], this));
    }
  }

  updateUI(timestamp) {
    let currentSubtitle = this.getCurrentSubtitle(timestamp);

    if (!currentSubtitle) {
      this.cfg.subtitleElement.innerHTML = '';
    } else {
      this.cfg.subtitleElement.innerHTML = currentSubtitle.content && currentSubtitle.content.join('<br>');

    }
  }

  addSubtitle(startTime) {
      let ts = '';

      if (isNaN(startTime)) {
        ts = startTime;
      } else {
        ts = Utils.convertSecondsToStringTimestamp(ts);
      }

      let secs = Utils.convertStringTimestampToSeconds(ts);
      secs += 0.1;
      let end = Utils.convertSecondsToStringTimestamp(secs);

      this.data.list.push({
        start: ts,
        end: end,
        content: []
      });

      this.renderList()
  }

  removeSubtitle(subtitle) {

  }

}
