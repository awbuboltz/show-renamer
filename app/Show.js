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
        let next = '01';

        if (this.episodes.length) {
            // parse all episode numbers and find the max and add 1
            next = Math.max.apply(Math,
                this.episodes.map((episode) => {
                    return parseInt(episode.episodeNum, 10);
                })
            ) + 1;

            // pad with a 0 if less than 10
            next = next < 10 ? '0' + next : next;
        }

        // add E in front of ##
        return `E${String(next)}`;
    }

    /** prints each episode fileName */
    printEpisodes() {
        if (this.episodes.length) {
            console.log(`Episodes in directory:`);

            this.episodes.forEach((episode) => {
                console.log(`${episode.fileName}`);
            });

            console.log();
        }
    }

    /**
     * @returns {string}
     * @private
     */
    _getSeason() {
        // assumes current directory ends with "/Show Name/Season ##"
        let season = this.filePath.substring(this.filePath.lastIndexOf('/') + 1, this.filePath.length).split(' ')[1];
        if (season) {
            season = season.trim();
            // ensure 0 prefix for < 10 numbers
            if (season.length < 2) {
                console.log(`Warning: Season "${season}" is not 0 padded`);
                season = '0' + season;
            }

            // add S in front of ##
            return `S${season}`;
        }
        else {
            console.log('Error: Directory does not end with "Season ##"');
            process.exit();
        }
    }

    /**
     * @returns {string}
     * @private
     */
    _getShowName() {
        // assumes current directory ends with "/Show Name/Season ##"
        const parts = this.filePath.split('/');
        return parts[parts.length - 2].trim();
    }
}

module.exports = Show;