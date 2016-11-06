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
rl.question('Filepath: ', (filepath) => {
    const show = new Show(filepath);

    fs.readdir(show.path, (err, files) => {
        if (err) {
            console.log(err);
            return;
        }

        var parts, episodesToRename = [];

        files.forEach((name) => {
            parts = name.split('-');

            // if filename is in expected format of "Show Name - S##-E##.ext" then we can assume it is properly formatted
            if (parts.length === 3) {
                // add FormattedEpisode object to the shows list of episodes
                show.addEpisode(new FormattedEpisode(name, parts));
            }
            else {
                // needs to be formatted
                episodesToRename.push(new Episode(name));
            }
        });

        console.log(`Episodes:`);
        show.printEpisodes();

        if (episodesToRename.length) { // TODO: loop these (promises?)
            var curEp = episodesToRename[0],
                newName = `${show.showName} - ${show.season}-${show.getNextEpisodeNum() + curEp.getExtension()}`,
                query = `Rename:\t"${curEp.fileName}"\nto:\t\t"${newName}"\n(y/n)?: `;

            rl.question(query, (answer) => {
                if (answer.toLowerCase() === 'y') {
                    fs.rename(`${show.path}/${curEp.fileName}`, `${show.path}/${newName}`, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
                else {
                    console.log('File not renamed');
                }
                rl.close();
            });
        }
        else {
            console.log('All episodes properly formatted');
        }
    });
});
