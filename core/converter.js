class Converter {
  cfg = {};
  constructor(config) {
    this.cfg = config;
  }

  getFileType() {
    return '.filetype';
  }

  getMimeType() {
    return 'text/plain;charset=utf-8';
  }

  convertObjectToFileContent(obj) {
    return 'filecontent'
  }

  convertFileContentToObject(fc) {
    return {list:[]};
  }


  async getData(file) {
    if (!file)
      return;

    let fileContent = await file.text();
    return this.convertFileContentToObject(fileContent)
  }

  async writeData(data) {
    let blob = new Blob([this.convertObjectToFileContent(data)], {type: this.getMimeType()})
    let url = URL.createObjectURL(blob);
    window.open(url,'_blank');
  }
}
