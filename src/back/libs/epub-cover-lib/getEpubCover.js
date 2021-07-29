const errorHandler = require('./errorHandler');
const parseOpf = require('./parseOpf');
const coverFromManifest = require('./coverFromManifest.js');
const coverFromMeta = require('./coverFromMeta.js');
const opfHrefToPath = require('./opfHrefToPath.js');

/* export a function that returns an error or a string with the path to the cover */
module.exports = (pathToEpub, cb = null) =>
    new Promise(async (resolve, reject) => {
        /* a helper that will pass an error message to either the callback or Promise.reject */
        const handleError = errorHandler(reject, cb); // returns a function

        /* get the path to the opf and convert opf to js */
        let opfData;
        try {
            opfData = await parseOpf(pathToEpub);
        } catch (e) {
            return handleError(e.message);
        }
        const { opfPath, opfJs } = opfData;

        /* check the manifest for item with property `cover-image`; fallback to checking the meta tag with name `cover` */
        const cover = coverFromManifest(opfJs) || coverFromMeta(opfJs);

        /* if there is no cover, handle error */
        if (!cover) {
            return handleError(
                'No cover image specified in package metadata or package manifest item properties.'
            );
        }

        /* create an absolute path from the relative coverImage path and the opf parent directory path */
        const coverImagePath = opfHrefToPath(opfPath, cover);

        /* if there's a callback, call it passing null for the err and the absolute path to the cover image as the value for data */
        if (cb) {
            return cb(null, coverImagePath);
        }

        /* resolve the promise with the absolute path to the cover image */
        return resolve(coverImagePath);
    }
);