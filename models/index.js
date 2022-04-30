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
    },
    usage() {
        return this.belongsToMany('Usage');
    },
    benefit() {
        return this.belongsToMany('Benefit');
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

const Benefit = bookshelf.model('Benefit', {
    tableName:'benefits',
    products() {
        return this.this.belongsToMany('Products')
    }
});

const Usage = bookshelf.model('Usage', {
    tableName:'usages',
    products() {
        return this.this.belongsToMany('Products')
    }
});

const User = bookshelf.model('User',{
    tableName: 'users'
})

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cartItems',
    products() {
        return this.belongsTo('Products')
    }
})


module.exports = { Products, Note, Size, Essentialoils, Scent, Usage, Benefit, User, CartItem };