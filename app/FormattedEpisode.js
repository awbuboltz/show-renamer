const Episode = require('./Episode');

class FormattedEpisode extends Episode {
    /** @returns {string} */
    get episodeNum() {
        // get the E##.ext part
        let end = this.parts[this.parts.length - 1],
            // separate the E## from E##.ext
            episode = end.split('.')[0];

        // drop the E
        return episode.slice(1);
    }
}

module.exports = FormattedEpisode;