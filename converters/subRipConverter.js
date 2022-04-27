class SubRipConverter extends Converter {
  constructor(config) {
    super(config);
  }

  getFileType() {
    return '.srt';
  }

  getMimeType() {
    return 'application/x-subrip';
  }

  convertObjectToFileContent(obj) {
    let entries = [];

    let list = obj.list || [];

    for (let i = 0; i < list.length; i++) {
      entries.push(`${i + 1}\n${list[i].start} --> ${list[i].end}\n${list[i].content.join('\n')}`);
    }
    let str = entries.join('\n\n');

    console.log(str);
    return str;
  }

  convertFileContentToObject(fc) {
    let textLines = fc.split('\n');
    let blocks = [];
    let tempBlock = {};

    for (let i = 0; i < textLines.length; i++) {
      let line = textLines[i].replace(/\r/g, '');
      if (tempBlock.index && tempBlock.start && tempBlock.end && tempBlock.content) {
        blocks[Number(tempBlock.index) - 1] = {
          start: tempBlock.start,
          end: tempBlock.end,
          content: tempBlock.content
        }
      }
      if (line.length == 0) {
        tempBlock = {};
      }

      if (!isNaN(Number(line))) {
        tempBlock.index = line;
      } else if (line.indexOf('-->') > -1) {
        let tsSplit = line.split('-->');
        tempBlock.start = tsSplit[0].replace(/\s*/g, '');
        tempBlock.end = tsSplit[1].replace(/\s*/g, '');
      } else if (line.length > 0) {
        if (tempBlock.content) {
          tempBlock.content.push(line);
        } else {
          tempBlock.content = [line];
        }
      }
    }

    return {
      list: blocks
    }
  }

}
