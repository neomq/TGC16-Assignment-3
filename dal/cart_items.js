const { CartItem, Products } = require('../models');


// retrieve all the items in the user shopping cart
async function getCart(userId) {
    return await CartItem.collection()
        .where({
            'user_id': userId
        }).orderBy("id","ASC").fetch({
            require: false, // will not throw an exception if no results are found
            withRelated: ['products', 'products.essentialoil', 'products.itemtype', 'products.size']
        });
}

// check whether the user has added an item to the cart
async function getCartItemByUserAndProduct(userId, productId) {
    return await CartItem.where({
        'user_id': userId,
        'product_id': productId
    }).fetch({
        'require': false
    })
}

// add a cart item
async function createCartItem(userId, productId, quantity) {

    // calculate subtotal of cart item
    const product = await Products.where({
        "id": productId
    }).fetch({
        require: false
    })
    let price = product.get('price')
    let sub_total = quantity * price

    // an instance of a model represents one row in the table
    // so to create a new row, simply create a new instance
    // of the model
    let cartItem = new CartItem({
        'user_id': userId,
        'product_id': productId,
        'item_quantity': quantity,
        'sub_total': sub_total
    });

    await cartItem.save(); // save the new row to the database
    return cartItem;
}

// update quantity of cart item
async function updateCartItemQuantity(userId, productId, quantity) {
    let cartItem = await getCartItemByUserAndProduct(userId, productId);
    
    // update cart item quantity
    cartItem.set('item_quantity', quantity);

    // update subtotal of cart item
    const product = await Products.where({
        "id": productId
    }).fetch({
        require: false
    })
    let price = product.get('price')
    let sub_total = quantity * price
    cartItem.set('sub_total', sub_total);
    
    await cartItem.save();
    return cartItem;
}

// remove an item from cart
async function removeFromCart(userId, productId) {
    let cartItem = await getCartItemByUserAndProduct(userId, productId);
    await cartItem.destroy();
}

module.exports = { getCart, createCartItem, getCartItemByUserAndProduct, updateCartItemQuantity, removeFromCart }