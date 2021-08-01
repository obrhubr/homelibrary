const fetch = require('node-fetch');

function getBookText(filepath) {
    return " ";
};

function addBookFTS(bookId, bookName, filepath) {
    let data = {'bookId': bookId.toString(), 'bookName': bookName.toString(),'text': getBookText(filepath)};
    fetch('http://localhost:1984/add', { method: 'POST', body: JSON.stringify(data) })
    .then(res => { return res.status })
    .then(status => {
        if(status == 200) {
            return;
        }
    });

    return;
};

function editBookFTS(bookId, bookName, filepath) {
    let data = {'bookId': bookId.toString()};

    if(bookName != undefined) {
        data.bookName = bookName;
    }
    if(filepath != undefined) {
        data.text = getBookText(filepath);
    }

    fetch('http://localhost:1984/edit', { method: 'POST', body: JSON.stringify(data) })
    .then(res => { return res.status })
    .then(status => {
        if(status == 200) {
            return;
        };
    });

    return;
};

function removeBookFTS(bookId) {
    let data = {'bookId': bookId.toString()};
    fetch('http://localhost:1984/remove', { method: 'POST', body: JSON.stringify(data) })
    .then(res => { return res.status })
    .then(status => {
        if(status == 200) {
            return;
        }
    });

    return;
};