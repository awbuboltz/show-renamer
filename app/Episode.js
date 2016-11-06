const path = require('path');

class Episode {
    /**
     * @param {string} fileName
     */
    constructor(fileName) {
        this.fileName = fileName;
        this.parts = Episode.breakIntoParts(fileName);
    }

    /** @returns {string} */
    getExtension() {
        return path.extname(this.fileName);
    }

    /**
     * if filename is in expected format of "Show Name - S##-E##.ext" then we can assume it is properly formatted
     * @param fileName
     * @returns {boolean}
     */
    static properlyFormatted(fileName) {
        try {
            var parts = this.breakIntoParts(fileName).map((part) => {
                    // trim everything
                    return part.trim();
                }),
                seasonNum = parts[1],
                // split on the "." for the extension and take first part
                episodeNum = parts[2].split('.')[0];

                return parts.length === 3 && seasonNum.length === 3 && episodeNum.length === 3;
        }
        catch(ignore) {
            return false;
        }
    }

    /**
     * breaks filename down on "-"
     * @param {string} fileName
     * @returns {Array}
     */
    static breakIntoParts(fileName) {
        return fileName ? fileName.split('-') : [];
    }
}

module.exports = Episode;
