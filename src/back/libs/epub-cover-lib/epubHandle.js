const extract = require('extract-zip');
const fs = require('fs/promises');
const path = require('path');
const getEpubCover = require('./getEpubCover');
const { logger } = require('../logger');

async function epubHandle(filename) {
    let imageFilename = 'images/nofile.png';
    try {
        await fs.mkdir('./public/images/' + filename, (err) => { if(err) { console.log(err); } });
        // Extracting .epub file into images folder
        await extract('./public/books/' + filename, { dir: path.resolve('./public/images/' + filename) });

        // This function returns the path of the cover image
        await getEpubCover('./public/images/' + filename)
        .then(async data => {
            let fileending = '.' + data.split('.')[data.split('.').length - 1];
            let filenamecopy = filename.substring(0, filename.length - 5) + fileending;

            await fs.copyFile(data, './public/images/' + filenamecopy, 0, (err) => { if(err) { console.log(err); } });
            console.log(filenamecopy);

            imageFilename = 'images/' + filenamecopy;
        })
        .catch(err => {
            logger.log("error", 'ROUTE: /epubHandle/ - Error while extracting epub: ' + err);
            return imageFilename;
        });

        // Remove the folder with the extracted .epub
        await fs.rmdir('./public/images/' + filename, { recursive: true }, (err) => { if(err) { console.log(err); } });
    } catch (err) {
        logger.log("error", 'ROUTE: /epubHandle/ - Error while extracting epub: ' + err);
        return imageFilename;
    }
    return imageFilename;
};

module.exports = { epubHandle };