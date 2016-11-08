require('console.table');
const fs = require('fs'),
    readline = require('readline'),
    path = require('path'),
    Show = require('./app/Show'),
    Episode = require('./app/Episode'),
    FormattedEpisode = require('./app/FormattedEpisode'),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    dev = {
        test: true,
        path: `${__dirname}\\test\\Show One\\Season 01`
    };

rl.question('Filepath: ', (filepath) => {
    // test mode
    filepath = filepath || (dev.test ? dev.path : filepath);
console.log(filepath);
    // ensure the filepath is valid
    fs.access(filepath, fs.F_OK, function(err) {
        if (!err) {
            const show = new Show(filepath);

            fs.readdir(show.filePath, (err, files) => {
                if (err) {
                    console.log(err);
                    return;
                }

                let episodesToRename = [];

                files.forEach((name) => {
                    // ensure path leads to a file, not a directory
                    if (fs.statSync(`${filepath}/${name}`).isFile()) {
                        if (Episode.properlyFormatted(name)) {
                            // add FormattedEpisode object to the shows list of episodes
                            show.addEpisode(new FormattedEpisode(name));
                        }
                        else {
                            // needs to be formatted
                            episodesToRename.push(new Episode(name));
                        }
                    }
                });

                if (show.episodes.length || episodesToRename.length) {

                    show.printEpisodes();

                    if (episodesToRename.length) { // TODO: loop these (promises?)
                        let curEp = episodesToRename[0],
                            newName = `${show.showName} - ${show.season}-${show.getNextEpisodeNum() + curEp.getExtension()}`,
                            query = `Rename:\t"${curEp.fileName}"\nto:\t\t"${newName}"\n(y/n)?: `;

                        rl.question(query, (answer) => {
                            if (answer.toLowerCase() === 'y') {
                                fs.rename(`${show.filePath}/${curEp.fileName}`, `${show.filePath}/${newName}`, (err) => {
                                    console.log(err || 'File renamed');
                                });
                            }
                            else {
                                console.log('Episode not renamed');
                            }
                            rl.close();
                        });
                    }
                    else {
                        console.log('All episodes properly formatted');
                    }
                }
                else {
                    console.log('No episodes found in directory');
                }
            });
        }
        else {
            console.log('Path is not valid');
        }
    });
});
