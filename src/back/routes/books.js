// Import environment variables
require('dotenv').config();

// Require dependencies
const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const { epubHandle } = require('../libs/epub-cover-lib/epubHandle');
const elastic = require('../libs/search-lib/elastic');

// require logger
const { logger } = require('../libs/logger');

// Require and configure multer, to save files to disk
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/books/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + '.epub');
    }
})
var upload = multer({ storage: storage });

// Connect to database
const Pool = require('pg').Pool;
const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DB,
    password: process.env.PG_PASSWORD,
    port: 5432,
});

// Return all books in the database
router.get('/all', async (req, res) => {
    const text = 'SELECT * FROM "books"';
    const values = [];

    try {
        logger.log('debug', 'Querying database: ' + text);
        const dbres = await pool.query(text, values);
        
        res.send(
            dbres.rows
        );
    } catch (err) {
        logger.log('error', 'ROUTE: /books/all - Error while fetching from database.');
        res.status(500).send({'error': 'Error while fetching from database.'});
    };
});

// Return the book with the correct id
router.get('/get/:bookid', async (req, res) => {
    const text = 'SELECT * FROM "books" WHERE id = $1';
    const values = [req.params.bookid];

    try {
        logger.log('debug', 'Querying database: ' + text);
        const dbres = await pool.query(text, values);
        
        if(dbres.rows.length == 0) {
            res.status(400).send({'error': 'Error fetching book from database, this book does not exist. '});
        } else {
            res.send(
                dbres.rows[0]
            );
        }

    } catch (err) {
        logger.log('error', 'ROUTE: /books/get/:bookid - Error while fetching from database.');
        res.status(500).send({'error': 'Error while fetching from database.'});
    };
});

// Replace all values by those sent by the post request for the book with the selected id
router.post('/edit/:bookid', upload.single('file'), async (req, res) => {
    const textGet = 'SELECT * FROM "books" WHERE id = $1';
    const valuesGet = [req.params.bookid];

    try {
        // Get old record
        logger.log('debug', 'Querying database: ' + textGet);
        const dbresGet = await pool.query(textGet, valuesGet);

        var oldValues = dbresGet.rows[0];
    } catch (err) {
        logger.log('error', 'ROUTE: /books/edit/:bookid - Error while fetching from database to get old values.');
        res.status(500).send({'error': 'Error while fetching from database.'});
    };

    const text = 'UPDATE books SET (title, time, author, description, image, filepath, keywords) = ($2, DEFAULT, $3, $4, $5, $6, $7) WHERE id = $1 RETURNING *;';
    var values = [req.params.bookid, oldValues.title, oldValues.author, oldValues.description, oldValues.image, oldValues.filepath, oldValues.keywords];

    if(req.file != undefined) {
        logger.log('info', 'Saved file to disk: "' + req.file.filename + '" .');

        var imagepath = 'images/nofile.png';
        var filepath = 'books/';

        try {
            filepath = 'books/' + req.file.filename;

            logger.log('info', 'ROUTE: /books/edit/:bookid - Extracting cover from epub.');

            imagepath = await epubHandle(req.file.filename);

            if(imagepath != 'images/nofile.png') {
                values[4] = imagepath;
                values[5] = filepath;

                // Delete old files
                logger.log('info', 'ROUTE: /books/edit/:bookid - Deleting files from disk: "' + oldValues.filepath + '", "' + oldValues.image + '" .');
                await fs.unlink('./public/' + oldValues.filepath);
                await fs.unlink('./public/' + oldValues.image);
            };
        } catch (err) {
            logger.log('error', 'ROUTE: /books/edit/:bookid - Error while saving book or extracting cover image.');
            res.status(500).send({'error': 'Error while saving book or extracting cover image.'});
            return;
        }
    }

    if(req.body.title != undefined) {
        values[1] = req.body.title;
    };
    if(req.body.author != undefined) {
        values[2] = req.body.author;
    };
    if(req.body.description != undefined) {
        values[3] = req.body.description;
    };
    if(req.body.keywords != undefined) {
        values[6] = req.body.keywords;
    };

    try {
        logger.log('debug', 'ROUTE: /books/edit/:bookid - Querying database: ' + text);
        const dbres = await pool.query(text, values);

        logger.log('debug', 'ROUTE: /books/edit/:bookid - Querying elasticsearch: editing document.');
        const esres = await elastic.editRow(req.params.bookid, values.concat([dbres.rows[0].id]));

        res.json(
            dbres.rows[0]
        );
    } catch (err) {
        logger.log('error', 'ROUTE: /books/edit/:bookid - Error while saving to database.');
        res.status(500).send({'error': 'Error while saving to database.'});
    };
});

// Add a book
router.post('/add', upload.single('file'), async (req, res) => {
    var imagepath = 'images/nofile.png';
    var filepath = 'books/';

    try {
        if(req.file) {
            logger.log('info', 'Saved file to disk: "' + req.file.filename + '" .');
            filepath = 'books/' + req.file.filename;
    
            logger.log('info', 'Extracting cover from epub.');
            imagepath = await epubHandle(req.file.filename);
        }
    } catch (err) {
        logger.log('error', 'ROUTE: /books/add - Error while handling saving book or extracting the cover image.');
        res.status(500).send({'error': 'Error while handling saving book or extracting the cover image.'});
        return;
    }

    const text = 'INSERT INTO books(title, author, description, image, filepath, keywords) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
    const values = [req.body.title, req.body.author, req.body.description, imagepath, filepath, req.body.keywords];

    for(val in values) {
        if(val == undefined) {
            res.status(400).send({'error': 'Error while saving to database, you always need to provide Title, author, description and keywords.'});
        };
    };

    try {
        logger.log('debug', 'ROUTE: /books/add - Querying database: ' + text);
        const dbres = await pool.query(text, values);

        logger.log('debug', 'ROUTE: /books/add - Querying elasticsearch: adding document.');
        const esres = await elastic.insertNew(values.concat([dbres.rows[0].id]));

        res.json(
            dbres.rows[0]
        );
        return;
    } catch (err) {
        logger.log('error', 'ROUTE: /books/add - Error while saving to the database.');
        res.status(500).send({'error': 'Error while saving to the database.'});
        return;
    };
});

// Remove the book with the selected id from the database
router.post('/remove/:bookid', async (req, res) => {
    const text = 'DELETE FROM books WHERE id = $1 RETURNING *;';
    const values = [req.params.bookid];

    try {
        logger.log('debug', 'ROUTE: /books/remove/:bookid - Querying database: ' + text);
        const dbres = await pool.query(text, values);

        logger.log('debug', 'ROUTE: /books/remove/:bookid - Querying elasticsearch: deleting document.');
        await elastic.deleteRow(req.params.bookid);

        try {
            logger.log('info', 'Deleting files from disk: "' + dbres.rows[0].filepath + '", "' + dbres.rows[0].image + '" .');
            await fs.unlink('./public/' + dbres.rows[0].filepath);
            if(dbres.rows[0].image !== 'images/nofile.png') {
                await fs.unlink('./public/' + dbres.rows[0].image);
            };
        } catch (err) {
            logger.log('error', 'ROUTE: /books/remove/:bookid - Error while deleting files from the server.');
            res.status(500).send({'error': 'Error while deleting files from the server.'});
            return;
        }

        if(dbres.rows[0].length == 0) {
            res.status(400).send({'error': 'Error while removing from the database, book does not exist.'});
        }

        res.json(
            dbres.rows[0]
        )
    } catch (err) {
        logger.log('error', 'ROUTE: /books/remove/:bookid - Error while removing from the database.');
        res.status(500).send({'error': 'Error while removing from the database.'});
        return;
    };
});

module.exports = router;