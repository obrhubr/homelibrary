require('dotenv').config();

const express = require('express');
const router = express.Router();
const elastic = require('../libs/search-lib/elastic');
const fetch = require('node-fetch');

async function getResultsFromQuery(query) {
    const { hits } = await elastic.elasticClient.search({
        'from':  0,
        'size':  100,
        'index': elastic.index, 
        'type':  elastic.type,
        'body':  query
    });
    
    const results = hits.total.value;
    
    const values  = hits.hits.map((hit) => {
        return {
            'id': hit._id,
            'book_id': hit._source.book_id,
            'title':  hit._source.title,
            'author': hit._source.author,
            'description': hit._source.description,
            'keywords': hit._source.keywords,
            'time': hit._source.time,
            'filepath': hit._source.filepath,
            'image': hit._source.image,
            'score':  hit._score
        }
    });

    return { results, values };
}

router.get('/byId/:text', async (req, res) => {
    const query = {
        'query': {
            'match': {
                'book_id': req.params.text
            }
        }
    };
    
    var esres = await getResultsFromQuery(query);
    res.send(esres);
});

router.get('/all', async (req, res) => {
    const query = {
        'query': {
            'match_all': { }
        }
    };
    
    var esres = await getResultsFromQuery(query);
    res.send(esres);
});

router.get('/simple/:text', async (req, res) => {
    const query = {
        'query': {
            'multi_match': {
                'query' : req.params.text,
                'fields' : [ 
                    'title^3', 
                    'author^2', 
                    'description', 
                    'keywords^3'
                ],
                "fuzziness" : 10
            }
        }
    };
    
    var esres = await getResultsFromQuery(query);
    res.send(esres);
});

router.get('/search-as-you-type/:text', async (req, res) => {
    const query = {
        'query': {
            'multi_match': {
                'query' : req.params.text,
                'fields' : [
                    'title',
                    'title._2gram',
                    'title._3gram',

                    'author',
                    'author._2gram',
                    'author._3gram',

                    'description',
                    'description._2gram',
                    'description._3gram',

                    'keywords',
                    'keywords._2gram',
                    'keywords._3gram',
                ],
                "fuzziness": 10
            }
        }
    };
    
    let esres = await getResultsFromQuery(query);
    res.send(esres);
});

// Routes to query fts service
router.get('/books/one/:bookId/:text', async (req, res) => {
    let data = {'bookId': req.params.bookId, 'searchText': req.params.text,'stopAfterOne': false};
    fetch('http://' + process.env.FTS_HOST + ':' + process.env.FTS_PORT + '/search/one', { method: 'POST', body: JSON.stringify(data) })
    .then(res => { return res.json() })
    .then(json => {
        res.json(json);
    });
});

router.get('/books/all/:text', async (req, res) => {
    let data = {'bookId': req.params.bookId, 'searchText': req.params.text,'stopAfterOne': true};
    fetch('http://' + process.env.FTS_HOST + ':' + process.env.FTS_PORT + '/search/all', { method: 'POST', body: JSON.stringify(data) })
    .then(res => { return res.json() })
    .then(json => {
        res.json(json);
    });
});

module.exports = router;