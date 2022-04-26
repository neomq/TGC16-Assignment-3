const bookshelf = require('../bookshelf')

const Essentialoil = bookshelf.model('Essentialoil', {
    tableName:'essentialOils',
    note() {
        return this.belongsTo('Note')
    }
});

const Note = bookshelf.model('Note', {
    tableName:'note',
    essentialoils() {
        return this.hasMany('Essentialoil')
    }
});

module.exports = { Essentialoil, Note };