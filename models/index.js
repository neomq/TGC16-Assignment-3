const bookshelf = require('../bookshelf')

const Essentialoil = bookshelf.model('Essentialoil', {
    tableName:'essentialOils'
});

module.exports = { Essentialoil };