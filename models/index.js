const bookshelf = require('../bookshelf')

const Essentialoil = bookshelf.model('Essentialoil', {
    tableName:'essentialOils'
});

const Note = bookshelf.model('Note', {
    tableName:'note'
});

module.exports = { Essentialoil, Note };