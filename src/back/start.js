const app = require('./main');

// require logger
const { logger }= require('./libs/logger');

// Listen to port
app.listen(process.env.PORT, () => { 
    logger.log('info', "Server listening on port: " + process.env.PORT);
});