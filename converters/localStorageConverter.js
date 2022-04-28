class LocalStorageConverter extends Converter {
  constructor(config) {
    super(config);
  }

  getFileType() {
    return '';
  }
  getMimeType() {
    return 'localStorage';
  }

  convertFileContentToObject(fc) {
    return JSON.parse(fc);
  }

  convertObjectToFileContent(obj) {
    return JSON.stringify(obj);
  }

  async getData(file) {
    return this.convertFileContentToObject(window.localStorage.getItem('tempSave'))
  }

  async writeData(data) {
      window.localStorage.setItem('tempSave', this.convertObjectToFileContent(data));
  }
}
