const fs = require('fs');
const EPub = require('epub');
const htmlToText = require('html-to-text');
const path = require('path');
const htmlParser = require('node-html-parser');
const { exec } = require("child_process");

// require logger
const { logger } = require('../libs/logger');

// class EPUBToText is COPIED FROM https://github.com/Projet-TAMIS/epub-to-text/blob/master/index.js
class EPUBToText {
    /**
     * EpubToText#extract()
     *
     * Opens the EPUB in sourceFile, extracts all chapters
     * and calls a callback function with the chapter content.
     * Callback parameters are (err, chapterText, sequenceNumber).
     *
     * An optional callback function can also be called initially,
     * at the beginning of the extraction.
     * Callback parameters are (err, numberOfChapters)
     **/
    extract(sourceFile, callback, initialCallback) {
        var epub = new EPub(sourceFile);
        var klass = this;

        // callback fired for each chapter (or they are written to disk)
        epub.on('end', function() {
        epub.flow.forEach(function(chapter, sequence) {
            epub.getChapter(chapter.id, function(err, html) {
            var txt = '';
            if (html) {
                txt = htmlToText.fromString(html.toString(), {ignoreHref: true});
            };
            var meta = {};
            meta.id = chapter.id;
            meta.excerpt = txt.trim().slice(0, 250);
            meta.size = txt.length
            meta.sequence_number = sequence
            if (chapter.title) {
                meta.title = chapter.title
            } else {
                meta.title = klass.getTitleFromHtml(html);
            }
            callback(err, txt, sequence, meta);
            });
        });
        });

        // callback as soon as file is ready to give info on how many chapters will be processed
        epub.on('end', function() {
        if (initialCallback) {
            initialCallback(null, epub.flow.length);
        };
        });

        epub.parse();
    }

    /**
     * EpubToText#extractTo()
     *
     * Opens the EPUB in sourceFile and saves all chapters
     * in destFolder. Chapters will be name according to the
     * original file name, prefixed by a 5-digit sequence number
     * Call a callback function when done.
     * Callback parameters are (err)
     **/
    extractTo(sourceFile, destFolder, callback) {
        var totalCount;
        var processedCount = 0;

        this.extract(sourceFile, (err, txt, sequence) => {
        var destFile = destFolder + '/' + sequence + '-' + path.basename(sourceFile) + '.txt'
        fs.writeFileSync(destFile, txt);
        processedCount += 1;
        if (processedCount >= totalCount) {
            callback(null);
        }
        }, (err, numberOfChapters) => {
        totalCount = numberOfChapters
        });
    }

    /**
     * EpubToText#getTitleFromHtml()
     *
     * Best efforts to find a title in the HTML tags (title, H1, etc.)
     **/
    getTitleFromHtml(html) {
        const root = htmlParser.parse(html);
        var title = root.querySelector('h1');
        if (title == null) {
        title = root.querySelector('title');
        if (title == null) {
            return '';
        };
        };
        return title.structuredText.replace("\n", " ");
    }
}

function getTxtFromEpub(filepath, trace_id, callback) {
    var epubToText = new EPUBToText;

    fs.mkdirSync('./public/epub-txt/' + filepath, (err) => { 
        if(err) {
            throw err;
        }
    });

    
    logger.log('info', `[${trace_id}] Epub-to-txt - Calling function to extract text from ebook. `);
    epubToText.extractTo('./public/' + filepath, './public/epub-txt/' + filepath, (err) => {
        if(err) throw err;
        callback();
    });
};

function combineFiles(filepath, trace_id, callback) {
    try {
        // append all files
        logger.log('info', `[${trace_id}] Epub-to-txt - Appendig individual chapter text files. `);
        exec("cat ./public/epub-txt/" + filepath + "/*.txt >> ./public/epub-txt/" + filepath + "/all.txt", (error, stdout, stderr) => {
            if (error) {
                throw err;
            } else {
                callback();
            };
        });
    } catch (err) {
        throw err;
    } 
};

function epubToTxt(filepath, trace_id, callback) {
    logger.log('info', `[${trace_id}] Epub-to-txt - Extracting text from ebook. `);
    getTxtFromEpub(filepath, trace_id, () => {
        combineFiles(filepath, trace_id, () => {
            callback();
        });
    });
};

module.exports = {
    epubToTxt
}