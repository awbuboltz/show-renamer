'use strict';
const path = require('path');

class Show {
    /** @param {string} filePath */
    constructor(filePath) {
        // windows slashes
        this.filePath = path.normalize(filePath).trim().replace(/\\/g, '/');
        this.showName = this._getShowName();
        this.season = this._getSeason();
        this._episodes = [];
    }

    /**
     * adds an episode to the episodes array
     * @param {Episode} episode
     */
    addEpisode(episode) {
        this._episodes.push(episode);
    }

    /**
     * returns an array of either properly formatted or improperly formatted episodes
     * @param {boolean|undefined} [properlyFormatted] - undefined: all, true: proper format, false: improper format
     * @returns {Array.<Episode>}
     */
    getEpisodes(properlyFormatted) {
        if (typeof properlyFormatted === 'undefined') {
            return this._episodes;
        }

        return this._episodes.filter(episode => {
            let thisFormatted = episode.properlyFormatted();
            return properlyFormatted ? thisFormatted : !thisFormatted;
        });
    }

    /**
     * one more than the highest found episode number
     * @returns {string}
     */
    get nextEpisodeNum() {
        let next = '01',
            properEpisodes = this.getEpisodes(true);

        if (properEpisodes.length) {
            // parse all episode numbers, find the max and add 1
            next = Math.max.apply(Math,
                properEpisodes.map((episode) => {
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
        let allEpisodes = this.getEpisodes();

        if (allEpisodes.length) {
            console.log(`Episodes in directory:`);

            allEpisodes.forEach((episode) => {
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