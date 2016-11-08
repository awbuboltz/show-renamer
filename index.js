require('console.table');
const fs = require('fs'),
    readline = require('readline'),
    Show = require('./app/Show'),
    Episode = require('./app/Episode'),
    FormattedEpisode = require('./app/FormattedEpisode'),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    // testing
    dev = {
        test: true,
        path: `${__dirname}\\test\\Show One\\Season 01`
    };

rl.question('Filepath: ', filepath => {
    // test mode
    filepath = filepath || (dev.test ? dev.path : filepath);

    console.log();

    // ensure the filepath is valid
    fs.access(filepath, fs.F_OK, err => {
        if (!err) {
            const show = new Show(filepath);

            fs.readdir(show.filePath, (err, files) => {
                if (err) {
                    console.log(err);
                    return;
                }

                const episodesToRename = [];

                files.forEach(name => {
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

                    if (episodesToRename.length) {
                        let p = Promise.resolve();

                        episodesToRename.forEach(episode => { //TODO: getNextEpisode() will always return the same thing
                            p = p.then(() => {
                                return new Promise((resolve, reject) => {
                                    const newName = `${show.showName} - ${show.season}-${show.getNextEpisodeNum() + episode.getExtension()}`,
                                        query = `Rename:\t"${episode.fileName}"\nto:\t\t"${newName}"\n(y/n/q to quit)?: `;

                                    rl.question(query, answer => {
                                        switch (answer.toLowerCase()) {
                                            case 'y':
                                                fs.rename(`${show.filePath}/${episode.fileName}`, `${show.filePath}/${newName}`, err => {
                                                    console.log(err || 'File renamed');
                                                    resolve();
                                                });
                                                break;
                                            case 'q':
                                                console.log('Exiting');
                                                process.exit();
                                                break;
                                            case 'n':
                                                console.log('Episode not renamed');
                                                resolve();
                                                break;
                                        }

                                        console.log();
                                    });
                                });
                            });
                        });

                        p.then(() => {
                            console.log('All files renamed');
                            rl.close();
                            process.exit();
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
