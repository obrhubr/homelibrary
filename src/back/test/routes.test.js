const app = require("../main");
const request = require('supertest');
const connectDB = require('./db/connect');
const fetch = require('node-fetch');

describe('Test routes', () => {
    let pgPool;

    beforeAll(async () => {
        pgPool = connectDB.connectPG();

        const text = 'INSERT INTO books(title, author, description, image, filepath, keywords) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;';
        const values = ['Title', 'Author', 'Description', './test/image/path', './test/file/path', 'test,keywords'];

        const dbres = await pgPool.query(text, values);

        // delete all FTS data
        let res = await fetch('http://' + process.env.FTS_HOST + ':' + process.env.FTS_PORT + '/removeAll', { method: 'POST', body: JSON.stringify({}) });
    });

    afterAll(async () => {
        const text = 'DELETE FROM books;';
        const values = [];

        const dbres = await pgPool.query(text, values);

        await pgPool.end();

        // delete all FTS data
        let res = await fetch('http://' + process.env.FTS_HOST + ':' + process.env.FTS_PORT + '/removeAll', { method: 'POST', body: JSON.stringify({}) });
    });

    test('Testing "/books/all" method', async () => {
        const res = await request(app).get("/books/all");

        // Check for statuscode
        expect(res.statusCode).toBe(200);

        // Check the response json
        expect(res.body[0].title).toBe('Title');
        expect(res.body[0].author).toBe('Author');
        expect(res.body[0].description).toBe('Description');
        expect(res.body[0].keywords).toBe('test,keywords');
    });

    test('Testing "/books/get/:bookid" method', async () => {
        const resId = await request(app).get("/books/all");
        const res = await request(app).get("/books/get/" + resId.body[0].id);

        // Check for statuscode
        expect(res.statusCode).toBe(200);
        
        // Check the response json
        expect(res.body.title).toBe('Title');
    });

    test('Testing "/books/add" method', async () => {
        const resAdd = await request(app).post("/books/add")
        .field('title', 'Title')
        .field('author', 'Author')
        .field('description', 'Description')
        .field('keywords', 'keywords,keywords')
        .attach('file', './test/assets/test.epub');

        const res = await request(app).get("/books/get/" + resAdd.body.id);

        // Check for statuscode
        expect(res.statusCode).toBe(200);
        
        // Check the response json
        expect(res.body.title).toBe('Title');

        // Check if fts is working as expected
        const resFTS = await request(app).get("/search/books/all/" + 'literary');

        //expect response to contain one result
        expect(resFTS.body.results[0].word).toBe(1817);
    });

    test('Testing "/books/edit/:bookid" method', async () => {
        const resAdd = await request(app).post("/books/add")
        .field('title', 'Title')
        .field('author', 'Author')
        .field('description', 'Description')
        .field('keywords', 'keywords,keywords')
        .attach('file', './test/assets/test.epub');;

        const resEdit = await request(app).post("/books/edit/" + resAdd.body.id)
        .field('title', 'Title2')
        .field('author', 'Author2')
        .field('description', 'Description2')
        .field('keywords', 'keywords2,keywords2');

        const res = await request(app).get("/books/get/" + resAdd.body.id);

        // Check for statuscode
        expect(res.statusCode).toBe(200);
        
        // Check the response json
        expect(res.body.title).toBe('Title2');
    });

    test('Testing "/books/remove/:bookid" method', async () => {
        // delete all FTS data
        let resFTSDeleteAll = await fetch('http://' + process.env.FTS_HOST + ':' + process.env.FTS_PORT + '/removeAll', { method: 'POST', body: JSON.stringify({}) });

        const resAdd = await request(app).post("/books/add")
        .field('title', 'Title')
        .field('author', 'Author')
        .field('description', 'Description')
        .field('keywords', 'keywords,keywords')
        .attach('file', './test/assets/test.epub');

        const resDelete = await request(app).post("/books/remove/" + resAdd.body.id);

        const res = await request(app).get("/books/get/" + resAdd.body.id);

        // Check for statuscode
        expect(res.statusCode).toBe(400);
        
        // Check if fts is working as expected
        const resFTS = await request(app).get("/search/books/all/" + 'literary');

        //expect response to contain no results
        expect(resFTS.body.results).toBe(null);
    });
});
