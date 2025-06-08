class SubtitleManager {
  cfg = {};
  data = {list:[]};
  snaps = [];

  dataSnapshots= [];

  constructor(config) {
    this.cfg = config;
  }

  load(data) {
    this.data = data;
    this.pushCurrentStateToSnapshots();
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

    for (let i = this.data.list.length - 1; i >= 0; i--) {
      this.snaps.push(new Snap(this.cfg.listElement, this.data.list[i], this));
    }
  }

  updateUI(timestamp) {
    let currentSubtitle = this.getCurrentSubtitle(timestamp);
    let subtitleIHTML = this.cfg.subtitleElement.innerHTML;
    let toSet = '';


    if (currentSubtitle) {
      toSet = currentSubtitle.content && currentSubtitle.content.join('<br>');
    }

    if (toSet != subtitleIHTML)
      this.cfg.subtitleElement.innerHTML = toSet;
  }

  addSubtitle(conf = {}) {
      let {startTime, endTime, referencePoint, isAfter} = conf;
      let focusRefSnap = -1;
      this.pushCurrentStateToSnapshots();
      let ts = '';

      if (isNaN(startTime)) {
        ts = startTime;
      } else {
        ts = Utils.convertSecondsToStringTimestamp(startTime);
      }

      let end = Utils.convertSecondsToStringTimestamp(Utils.convertStringTimestampToSeconds(ts) + 0.3);

      if (endTime !== null && endTime !== undefined) {
        if (isNaN(endTime)) {
          end = endTime;
        } else {
          end = Utils.convertSecondsToStringTimestamp(endTime);
        }
      }

      let subtitleObj = {
        start: ts,
        end: end,
        content: []
      };

      if (referencePoint) {
        let position = this.getIndexOfSubtitle(referencePoint);
        if (isAfter) {
          position ++;
        }

        this.data.list.splice(position, 0, subtitleObj);
        focusRefSnap = position + 1;
      } else {
        this.data.list.push(subtitleObj);
        focusRefSnap = this.data.list.length - 1;
      }

      this.renderList()

      if (focusRefSnap > -1) {
        let ref = this.data.list[focusRefSnap];
        this.focusSnap(ref);
      }
  }

  focusSnap(ref) {
    this.snaps.map((k) => {
      if (k.ref === ref)
        k.focusText();
    });
  }

  getSnaps() {
    return this.snaps;
  }

  removeSubtitle(subtitle) {
    this.pushCurrentStateToSnapshots();

    let position = this.getIndexOfSubtitle(subtitle);
    this.data.list.splice(position, 1);
    this.renderList();
  }

  getData() {
    return this.data;
  }

  pushCurrentStateToSnapshots() {
    this.dataSnapshots.unshift(JSON.stringify(this.data));

    if (this.dataSnapshots.length > 10) {
      this.dataSnapshots.splice(10, this.dataSnapshots.length - 10);
    }
  }

  restoreSnapshot() {
    if (this.dataSnapshots.length > 0) {
      this.data = JSON.parse(this.dataSnapshots[0]);
      this.dataSnapshots.splice(0,1);
      this.renderList();
    }
  }

  onScroll() {
    for (let i = 0; i < this.snaps.length; i++) {
      this.snaps[i].onScroll();
    }
  }

}
