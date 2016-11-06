const path = require('path');

class Episode {
    /**
     * @param {string} fileName
     * @param [parts=[]]
     */
    constructor(fileName, parts) {
        this.fileName = fileName;
        this.parts = parts || [];
    }

    /** @returns {string} */
    getExtension() {
        return path.extname(this.fileName);
    }
}

module.exports = Episode;
