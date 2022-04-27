class Converter {
  cfg = {};
  constructor(config) {
    this.cfg = config;
  }

  getFileType() {
    return '.filetype';
  }

  getMimeType() {
    return 'text/plain';
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

  async writeData(file) {

  }
}
