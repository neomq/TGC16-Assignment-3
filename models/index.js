const bookshelf = require('../bookshelf')

const Products = bookshelf.model('Products', {
    tableName:'products',
    itemtype() {
        return this.belongsTo('Itemtype')
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

const Itemtype = bookshelf.model('Itemtype', {
    tableName:'item_type',
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
    tableName:'essentialoils',
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
    tableName: 'cart_items',
    products() {
        return this.belongsTo('Products')
    }
})

const Orderstatus = bookshelf.model('Orderstatus',{
    tableName: 'order_status'
})

module.exports = {
                    Products,
                    Itemtype,
                    Size, 
                    Essentialoils, 
                    Scent, 
                    Usage, 
                    Benefit, 
                    User, 
                    CartItem,
                    Orderstatus
                };