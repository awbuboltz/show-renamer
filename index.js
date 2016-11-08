'use strict';
require('console.table');
const fs = require('fs'),
    readline = require('readline'),
    Show = require('./app/Show'),
    Episode = require('./app/Episode'),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    // testing
    dev = {
        test: false,
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
                }
                else {
                    files.forEach(name => {
                        // ensure path leads to a file, not a directory
                        if (fs.statSync(`${filepath}/${name}`).isFile()) {
                            show.addEpisode(new Episode(name));
                        }
                    });

                    if (!show.getEpisodes().length) {
                        console.log('No episodes found in directory');
                    }
                    else {
                        show.printEpisodes();

                        let p = Promise.resolve();

                        show.getEpisodes(false).forEach(episode => { //TODO: getNextEpisode() will always return the same thing
                            p = p.then(() => {
                                return new Promise((resolve) => {
                                    const newName = `${show.showName} - ${show.season}-${show.nextEpisodeNum + episode.getExtension()}`,
                                        query = `Rename:\t"${episode.fileName}"\nto:\t\t"${newName}"\n(y/n/q to quit)?: `;

                                    rl.question(query, answer => {
                                        switch (answer.toLowerCase()) {
                                            case 'y':
                                                fs.rename(`${show.filePath}/${episode.fileName}`, `${show.filePath}/${newName}`, err => {
                                                    let msg = 'File renamed';

                                                    if (err) {
                                                        msg = err;
                                                    }
                                                    else {
                                                        episode.fileName = newName;
                                                    }
                                                    console.log(`${msg}\n`);
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
                            console.log('All episodes properly formatted\n');
                            show.printEpisodes();
                            rl.close();
                            process.exit();
                        });
                    }
                }
            });
        }
        else {
            console.log('Path is not valid');
        }
    });
});
