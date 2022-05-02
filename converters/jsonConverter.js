class JSONConverter extends Converter {
  constructor(config) {
    super(config);
  }

  getFileType() {
    return '.json';
  }
  getMimeType() {
    return 'application/json';
  }

  convertFileContentToObject(fc) {
    return JSON.parse(fc);
  }

  convertObjectToFileContent(obj) {
    return JSON.stringify(obj);
  }
  async writeData(data) {
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    let downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute('target', '_blank');
    downloadAnchorNode.setAttribute('style','display:none;');
    downloadAnchorNode.setAttribute("download", 'subtitle.json');
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
}
