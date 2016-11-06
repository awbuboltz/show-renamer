const path = require('path');

class Show {
    /** @param {string} filePath */
    constructor(filePath) {
        // windows slashes
        this.filePath = path.normalize(filePath).trim().replace(/\\/g, '/');
        this.showName = this._getShowName();
        this.season = this._getSeason();
        this.episodes = [];
    }

    /**
     * adds an episode to the episodes array
     * @param {Episode} episode
     */
    addEpisode(episode) {
        this.episodes.push(episode);
    }

    /**
     * one more than the highest found episode number
     * @returns {string}
     */
    getNextEpisodeNum() {
        if (this.episodes.length) {
            // TODO: should find higest episode number rather than assume array length
            var next = parseInt(this.episodes[this.episodes.length - 1].episodeNum, 10) + 1;
            if (next <  10) {
                next = '0' + next;
            }
        }
        else {
            next = 0;
        }

        // add E in front of ##
        return `E${String(next)}`;
    }

    /** prints each episode fileName */
    printEpisodes() {
        this.episodes.forEach((episode) => {
            console.log(`${episode.fileName}`);
        });
    }

    /**
     * @returns {string}
     * @private
     */
    _getSeason() {
        // assumes current directory ends with "/Show Name/Season ##"
        var season = this.filePath.substring(this.filePath.lastIndexOf('/') + 1, this.filePath.length).split(' ')[1];

        // ensure 0 prefix for < 10 numbers
        if (season.length < 2) {
            season = '0' + season.trim();
        }

        // add S in front of ##
        return `S${season}`;
    }

    /**
     * @returns {string}
     * @private
     */
    _getShowName() {
        // assumes current directory ends with "/Show Name/Season ##"
        var parts = this.filePath.split('/');
        return parts[parts.length - 2].trim();
    }
}

module.exports = Show;