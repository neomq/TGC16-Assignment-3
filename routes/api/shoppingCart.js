const express = require("express");
const router = express.Router();
const CartServices = require('../../services/cart_services');

// Get all shopping cart items
router.get('/:user_id', async function(req,res){
    let cartServices = new CartServices(req.params.user_id);
    try {
        const cartItems = await cartServices.getCart();
        res.status(200)
        res.send(cartItems.toJSON())
    } catch (e) {
        res.status(500)
        res.send("Unable to get shopping cart items")
    }
})

// Add item into shopping cart
router.get('/:user_id/add/:product_id', async function(req,res){
    let cartServices = new CartServices(req.params.user_id);
    try {
        await cartServices.addToCart(req.params.product_id, 1);
        res.status(200)
        res.send("Item added to shopping cart")
    } catch (e) {
        res.status(500)
        res.send("Unable to add item to shopping cart")
    }
})

// Update quantity of shopping cart item
router.post('/:user_id/updateQuantity/:product_id', async function(req,res){
    let cartServices = new CartServices(req.params.user_id);
    try {
        await cartServices.updateQuantity(req.params.product_id, req.body.newQuantity);
        res.status(200)
        res.send("Quantity of cart item updated")
    } catch (e) {
        res.status(500)
        res.send("Unable to update cart item quantity")
    }
})

// Delete cart item
router.get('/:user_id/remove/:product_id', async function(req,res){
    let cartServices = new CartServices(req.params.user_id);
    try {
        await cartServices.removeFromCart(req.params.product_id);
        res.status(200)
        res.send("Cart item removed")
    } catch (e) {
        res.status(500)
        res.send("Unable to remove cart item")
    }
});

module.exports = router; 

