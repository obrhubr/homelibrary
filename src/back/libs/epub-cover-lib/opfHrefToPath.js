const path = require('path');
/* convert an manifest item href to an absolute path */
module.exports = (opfPath, href) => path.resolve(path.dirname(opfPath), href);
