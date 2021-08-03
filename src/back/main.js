// Import environment variables
require('dotenv').config();

// Require dependencies
const express = require('express');
const app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
const promBundle = require("express-prom-bundle");
const { v4 } = require('uuid');

// CORS to make requests from the next frontend possible
app.use(cors());
app.use(bodyParser.urlencoded({ limit: '15mb', extended: false }))
// Create public folder to expose .epub and images to the world
app.use(express.static('public'))

const metricsMiddleware = promBundle({ 
    includeMethod: true, 
    includePath: true, 
    includeStatusCode: true, 
    customLabels: {project_name: 'nodejs'},
    normalizePath: [
        ['^/search/simple/.*', '/search/simple/#searchquery'],
        ['^/search/search-as-you-type/.*', '/search/search-as-you-type/#searchquery'],
        ['^/search/books/one/.*', '/search/books/one/#searchquery'],
        ['^/search/books/all/.*', '/search/books/all/#searchquery'],
    ],
});
app.use(metricsMiddleware);

app.all('*', function(req, res, next){
    res.locals.trace_id = v4();
    next();
});

// Create Router
const booksRouter = require('./routes/books');
const searchRouter = require('./routes/search');

// Bind router
app.use('/books', booksRouter);
app.use('/search', searchRouter);

module.exports = app;