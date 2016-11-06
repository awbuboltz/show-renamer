class Show {
    /**
     * @param {string} path
     */
    constructor(path) {
        this.path = path;
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
        var next = parseInt(this.episodes[this.episodes.length - 1].episodeNum, 10) + 1;
        if (next <  10) {
            next = '0' + next;
        }
        return `E${String(next)}`;
    }

    /**
     * @returns {string}
     * @private
     */
    _getSeason() {
        var season = this.path.substring(this.path.lastIndexOf('/') + 1, this.path.length).split(' ')[1];

        if (season.length < 2) {
            season = '0' + season.trim();
        }

        return `S${season}`;
    }

    /**
     * @returns {string}
     * @private
     */
    _getShowName() {
        var parts = this.path.split('/');
        return parts[parts.length - 2].trim();
    }
}

module.exports = Show;