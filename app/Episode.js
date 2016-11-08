'use strict';
const path = require('path');

class Episode {
    /** @param {string} fileName */
    constructor(fileName) {
        this.fileName = fileName || '';
    }

    /** @returns {string} */
    getExtension() {
        return path.extname(this.fileName);
    }

    /**
     * splits files on "-" separator
     * @returns {Array}
     */
    get parts() {
        return this.fileName.split('-');
    }

    /** @returns {string} */
    get episodeNum() {
        // get the E##.ext part
        let end = this.parts[this.parts.length - 1],
            // separate the E## from E##.ext
            episode = end.split('.')[0];

        // drop the E
        return episode.slice(1);
    }

    /**
     * if filename is in expected format of "Show Name - S##-E##.ext" then we can assume it is properly formatted
     * @returns {boolean}
     */
    properlyFormatted() {
        try {
            let trimmpedParts = this.parts.map((part) => {
                    // trim everything
                    return part.trim();
                }),
                seasonNum = trimmpedParts[1],
                // split on the "." for the extension and take first part
                episodeNum = trimmpedParts[2].split('.')[0];

                return trimmpedParts.length === 3 && seasonNum.length === 3 && episodeNum.length === 3;
        }
        catch (ignore) {
            return false;
        }
    }
}

module.exports = Episode;
