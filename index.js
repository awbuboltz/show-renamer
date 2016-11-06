require('console.table');
const fs = require('fs');
const readline = require('readline');
const Show = require('./app/Show');
const Episode = require('./app/Episode');
const FormattedEpisode = require('./app/FormattedEpisode');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const show = new Show('F:/TV Shows/Shark Tank/Season 8');

fs.readdir(show.path, (err, files) => {
    if (err) {
        console.log(err);
        return;
    }

    var parts, episodesToRename = [];

    files.forEach((name) => {
        parts = name.split('-');

        if (parts.length === 3) {
            show.addEpisode(new FormattedEpisode(name, parts));
        }
        else {
            episodesToRename.push(new Episode(name));
        }
    });

    var epsList = `Episodes:\n`;
    show.episodes.forEach((episode) => {
        epsList += `${episode.fileName}\n`;
    });
    console.log(epsList);

    if (episodesToRename.length) { // TODO: loop these
        var curEp = episodesToRename[0];
        var newName = `${show.showName} - ${show.season}-${show.getNextEpisodeNum() + curEp.getExtension()}`,
            query = `Rename:\t"${curEp.fileName}"\nto:\t\t"${newName}"\n(y/n)?: `;

        rl.question(query, (answer) => {
            if (answer.toLowerCase() === 'y') {
                fs.rename(`${show.path}/${curEp.fileName}`, `${show.path}/${newName}`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            rl.close();
        });
    }
    else {
        console.log('All episodes properly formatted');
    }
});