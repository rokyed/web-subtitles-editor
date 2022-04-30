class Utils {
  static DIFF_SECONDS_STEP = 0.1;
  
  static convertStringTimestampToSeconds(str) {
    let secs = 0;

    try {
      let ts = str.split(':');
      let hh = Number(ts[0]);
      let mm = Number(ts[1]);
      let ssms = Number(ts[2].replace(/\,/g,'.'));
      secs = (hh * 3600) + (mm * 60) + ssms;
    } catch (e) {
      console.error(e);
      console.log('failed to convert ts to seconds');
    }

    return secs;
  }
  static convertSecondsToStringTimestamp(ts) {
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
}
