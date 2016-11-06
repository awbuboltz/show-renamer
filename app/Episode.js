class Episode {
    /**
     * @param {string} fileName
     * @param [parts=[]]
     */
    constructor(fileName, parts) {
        this.fileName = fileName;
        this.parts = parts || [];
    }

    /**
     * @returns {string}
     */
    getExtension() {
        return this.fileName.substring(this.fileName.lastIndexOf('.'), this.fileName.length);
    }
}

module.exports = Episode;
