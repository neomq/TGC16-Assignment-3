const cartDataLayer = require('../dal/cart_items');

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    // GET ALL CART ITEMS FOR A USER
    async getCart() {
        return await cartDataLayer.getCart(this.user_id);
    }

    // ADD AN ITEM TO THE CART
    async addToCart(productId, quantity) {
        // todo: check if there is enough stock
        // todo: check if the user is eligible for discount
        // todo: for example - you can only buy one type of each category

        // todo: check if the currently logged in user
        // have already added the item to the cart
        let cartItem = await cartDataLayer.getCartItemByUserAndProduct(this.user_id, productId)
        if (cartItem) {
           await cartDataLayer.updateCartItemQuantity(
                    this.user_id, 
                    productId, 
                    cartItem.get('item_quantity') + quantity)
        } else {
            cartItem = await cartDataLayer.createCartItem(this.user_id, productId, quantity)
            return cartItem;
        }
    }

    // UPDATE CART ITEM QUANTITY
    async updateQuantity(productId, newQuantity) {
        // todo: check if enough stock exists etc.
        await cartDataLayer.updateCartItemQuantity(this.user_id, productId, newQuantity);
    }

    // REMOVE A CART ITEM FROM THE CART
    async removeFromCart(productId) {
        await cartDataLayer.removeFromCart(this.user_id, productId);
    }
}

module.exports = CartServices;