const bookshelf = require('../bookshelf')

const Products = bookshelf.model('Products', {
    tableName:'products',
    note() {
        return this.belongsTo('Note')
    },
    size() {
        return this.belongsTo('Size')
    },
    essentialoil() {
        return this.belongsTo('Essentialoils')
    }
});

const Note = bookshelf.model('Note', {
    tableName:'note',
    products() {
        return this.hasMany('Products')
    }
});

const Size = bookshelf.model('Size', {
    tableName:'size',
    products() {
        return this.hasMany('Products')
    }
});

const Essentialoils = bookshelf.model('Essentialoils', {
    tableName:'essentialOils',
    products() {
        return this.hasMany('Products')
    }
});

module.exports = { Products, Note, Size, Essentialoils };