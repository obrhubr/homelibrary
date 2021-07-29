const app = require("../main");
const { epubHandle } = require('../libs/epub-cover-lib/epubHandle');
const fs = require('fs/promises');

describe('Test routes', () => {
    beforeAll(async () => {
    });

    afterAll(async () => {
    });

    test('Testing extracting cover image from epub', async () => {
        await fs.copyFile('./test/assets/test.epub', './public/books/test.epub', 0, (err) => { if(err) { console.log(err); } });

        const path = await epubHandle('test.epub');

        expect(path).not.toBe('images/nofile.png');

        fs.access('./public/' + path, fs.F_OK, (err) => {
            if (err) {
                throw new Error('File does not exist.')
            }
        });

        await fs.unlink('./public/books/test.epub');
        await fs.unlink('./public/images/test.jpeg');
    });
});