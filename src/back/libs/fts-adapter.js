require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const ett = require('./epub-to-text');
const { promisify } = require('util');

// require logger
const { logger } = require('../libs/logger');

async function addBookFTS(bookId, bookName, filepath, trace_id) {
    try {
        // Get text from book
        let func = promisify(ett.epubToTxt);
        await func(filepath, trace_id);
        
        // Read the text file
        let text = fs.readFileSync('./public/epub-txt/' + filepath + '/all.txt', 'utf8');
    
        logger.log('info',  `[${trace_id}] Epub-to-txt - Successfully extracted text from ebook. `);

        // Remove the folder with the extracted .epub
        await fs.rm('./public/epub-txt/' + filepath, { recursive: true }, (err) => { if(err) { console.log(err); } });

        // send request to FTS
        let data = {'bookId': bookId.toString(), 'bookName': bookName.toString(),'text': text};
        let res = await fetch('http://' + process.env.FTS_HOST + ':' + process.env.FTS_PORT + '/add', { method: 'POST', body: JSON.stringify(data) });
        let json = await res.json();

        if(res.status == 200) {
            logger.log('info',  `[${trace_id}] FTS addBookFTS - Successfully added book to FTS. `);
            return;
        } else {
            logger.log('error',  `[${trace_id}] FTS addBookFTS - Error with request(add) to FTS: ${json.response}`);
            throw new Error('Error while adding new book to FTS: ' + json.response);
        }
    } catch (err) {
        logger.log('error',  `[${trace_id}] FTS addBookFTS - Error while adding book to FTS. `);
        logger.log('debug',  `[${trace_id}] ${err}`);
        return;
    }
};

async function editBookFTS(bookId, bookName, filepath, trace_id) {
    try {
        let data = {'bookId': bookId.toString()};
    
        // check for changes in data
        if(bookName != undefined) {
            data.bookName = bookName;
        }
        if(filepath != undefined) {
            // Get text from book
            let func = promisify(ett.epubToTxt);
            await func(filepath, trace_id);
            
            // Read the text file
            data.text = fs.readFileSync('./public/epub-txt/' + filepath + '/all.txt', 'utf8');
        }
        
        // send request to FTS
        let res = await fetch('http://' + process.env.FTS_HOST + ':' + process.env.FTS_PORT + '/edit', { method: 'POST', body: JSON.stringify(data) });
        let json = res.json();
    
        if(res.status == 200) {
            logger.log('info',  `[${trace_id}] FTS editBookFTS - Successfully edited book on FTS. `);
            return;
        } else {
            logger.log('error',  `[${trace_id}] FTS editBookFTS - Error with request(edit) to FTS: ${json.response} `);
            throw new Error('Error while editing book on FTS: ' + json.response);
        }
    } catch (err) {
        logger.log('error',  `[${trace_id}] FTS editBookFTS - Error while editing book on FTS. `);
        logger.log('debug',  `[${trace_id}] ${err} `);
        throw err;
    }
};

async function removeBookFTS(bookId, trace_id) {
    try {
        // send request to FTS
        let data = {'bookId': bookId.toString()};
        let res = await fetch('http://' + process.env.FTS_HOST + ':' + process.env.FTS_PORT + '/remove', { method: 'POST', body: JSON.stringify(data) });
        let json = res.json();
    
        if(res.status == 200) {
            logger.log('info',  `[${trace_id}] FTS removeBookFTS - Successfully removed book on FTS. `);
            return;
        } else {
            logger.log('error',  `[${trace_id}] FTS removeBookFTS - Error with request(remove) to FTS: ${json.response}`);
            throw new Error('Error while removing new book to FTS: ' + json.response);
        }
    } catch (err) {
        logger.log('error',  `[${trace_id}] FTS removeBookFTS - Error while removing book on FTS. `);
        logger.log('debug',  `[${trace_id}] ${err}`);
        throw err;
    }
};

module.exports = {
    addBookFTS,
    editBookFTS,
    removeBookFTS
};