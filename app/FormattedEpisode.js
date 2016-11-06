const Episode = require('./Episode');

class FormattedEpisode extends Episode {
    /**
     * @returns {string}
     */
    get episodeNum() {
        var end = this.parts[this.parts.length - 1],
            episode = end.split('.')[0];

        return episode.slice(1);
    }
}

module.exports = FormattedEpisode;