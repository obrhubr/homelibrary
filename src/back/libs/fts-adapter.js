const fetch = require('node-fetch');

async function getBookText(filepath) {
    return " ";
};

async function addBookFTS(bookId, bookName, filepath) {
    let data = {'bookId': bookId.toString(), 'bookName': bookName.toString(),'text': await getBookText(filepath)};
    let res = await fetch('http://localhost:1984/add', { method: 'POST', body: JSON.stringify(data) });
    let json = res.json();

    if(res.status == 200) {
        return;
    } else {
        throw new Error('Error while adding new book to FTS: ' + json.response);
    }

    return;
};

async function editBookFTS(bookId, bookName, filepath) {
    let data = {'bookId': bookId.toString()};

    if(bookName != undefined) {
        data.bookName = bookName;
    }
    if(filepath != undefined) {
        data.text = await getBookText(filepath);
    }

    let res = await fetch('http://localhost:1984/edit', { method: 'POST', body: JSON.stringify(data) });
    let json = res.json();

    if(res.status == 200) {
        return;
    } else {
        throw new Error('Error while adding new book to FTS: ' + json.response);
    }

    return;
};

async function removeBookFTS(bookId) {
    let data = {'bookId': bookId.toString()};
    let res = await fetch('http://localhost:1984/remove', { method: 'POST', body: JSON.stringify(data) });
    let json = res.json();

    if(res.status == 200) {
        return;
    } else {
        throw new Error('Error while adding new book to FTS: ' + json.response);
    }

    return;
};

module.exports = {
    addBookFTS,
    editBookFTS,
    removeBookFTS
};