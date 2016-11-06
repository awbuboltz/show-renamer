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
        var fn = this.fileName;
        return fn.substring(fn.lastIndexOf('.'), fn.length);
    }
}

module.exports = Episode;
