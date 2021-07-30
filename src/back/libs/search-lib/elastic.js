require('dotenv').config();

const fetch = require('node-fetch')
const express = require('express');
const router = express.Router();
const elastic = require('elasticsearch');
const { logger } = require('../logger');

const elasticClient = elastic.Client({
    host: process.env.ELASTIC_HOST + ':9200'
});

const index = "books";
const type = "books";

async function createIndex(index) { 
    try {
        await elasticClient.indices.create({ index });
        logger.log('info', `Created index ${index}`);
    } catch (err) {
        logger.log('error', `An error occurred while creating the index ${index}: ` + err);
    }
};

async function setBooksMapping () {
    try {
        const schema = {
            'book_id': {
                'type': "text"
            },
            'title': {
                'type': "search_as_you_type" 
            },
            'author': {
                'type': "search_as_you_type"
            },
            'description': {
                'type': "search_as_you_type" 
            },
            'keywords': {
                'type': "text"
            },
            'time': {
                'type': "text"
            },
            'filepath': {
                'type': "text"
            },
            'image': {
                'type': "text"
            }
        };
  
        await elasticClient.indices.putMapping({ 
            index,
            'include_type_name': true,
            'body': { 
                'properties': schema 
            }
        })
  
        logger.log('info', "Books mapping created successfully");
        return;
    } catch (err) {
        logger.log('error', "Error while creating books mapping in elasticsearch: " + err);
        return;
    }
    return;
}; 

function checkConnection() {
    return new Promise(async (resolve) => {
        logger.log('info', "Checking connection to ElasticSearch...");
        let isDown = true;
        while(isDown) {
            fetch('http://' + process.env.ELASTIC_HOST + ':9200/')
            .then((res) => { 
                if(res.status == 200) {
                    isDown = false;
                };
            })
            .catch((err) => {
                console.error(err);
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
        };
        elasticClient.ping({
            requestTimeout: 30000,
        }, function(error) {
            // at this point, elastic search is down, please check your Elasticsearch service
            if (error) {
                logger.log('error', 'Elasticsearch cluster is down! ');
                resolve(false);
            } else {
                logger.log('info', 'Connection to elasticsearch is working.');
                resolve(true);
            };
        });
    });
};

async function insertNew(list) {
    return elasticClient.index({
        index,
        id: list[6].toString(),
        'body': {
            'book_id': list[6],
            'title': list[0],
            'author': list[1],
            'description': list[2],
            'keywords': list[5].split(','),
            'time': new Date(),
            'filepath': list[4],
            'image': list[4]
        }
    });
}

async function editRow(bookid, list) {
    await elasticClient.update({
        index,
        id: bookid.toString(),
        body: {
            doc: {
                'book_id': list[7],
                'title': list[1],
                'author': list[2],
                'description': list[3],
                'keywords': list[6].split(','),
                'filepath': list[5],
                'image': list[4]
            }
        }
    });
}

async function deleteRow(bookid) {
    await elasticClient.delete({
        index,
        id: bookid.toString()
    });
}

module.exports = {
    elasticClient,
    setBooksMapping,
    checkConnection,
    createIndex,
    index,
    type,
    insertNew,
    editRow,
    deleteRow
};