const elastic = require('./libs/search-lib/elastic');

(async () => {
    try {
        console.log('Check if elastic is ready')
        const isElasticReady = await elastic.checkConnection();
        if(isElasticReady) {
            const elasticIndex = await elastic.elasticClient.indices.exists({ index: elastic.index });
            
            if(!elasticIndex.body) {
                // Creating elastic index and setting the mapping
                console.log('Creating index and setting mapping');
                await elastic.createIndex(elastic.index);
                await elastic.setBooksMapping();
                console.log('Finished creating up index and mapping');
            }
        }
    } catch (e) {
        console.log('Catastrophic failure while connecting to elasticsearch');
    }
})();