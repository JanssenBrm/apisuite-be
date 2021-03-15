class Storage {
  constructor (config) {
    this.config = config
    if (new.target === Storage) {
      throw new Error('Cannot construct Storage instances directly')
    }

    if (this.saveFile === Storage.prototype.saveFile) {
      throw new Error(`Storage[${new.target}]: missing saveFile implementation`)
    }
  }

  /**
   * Storage client file upload result.
   * @typedef {Object} SaveFileResult
   * @property {String} objectURL
   * @property {Error} error
   */

  /**
   * @abstract
   * @param {String} filePath - file to save on the cloud
   * @param {String} name - name for the file on the cloud
   * @returns {Promise<SaveFileResult>}
   * */
  async saveFile (filePath, name) {
    throw new Error('Storage.saveFile should not be called directly')
  }
}

module.exports = Storage
