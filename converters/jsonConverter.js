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
}
