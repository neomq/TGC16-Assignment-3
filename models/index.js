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
    },
    scent() {
        return this.belongsToMany('Scent');
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

const Scent = bookshelf.model('Scent', {
    tableName:'scent',
    products() {
        return this.this.belongsToMany('Products')
    }
});

module.exports = { Products, Note, Size, Essentialoils, Scent };