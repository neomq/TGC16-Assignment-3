const express = require('express');
const router = express.Router();
const { checkIfAuthenticated } = require('../../middlewares');
const CartServices = require('../../services/cart_services');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', checkIfAuthenticated, async function(req,res) {
    // 1. get all the cart items
    let cartServices = new CartServices(req.query.user_id);
    let items = await cartServices.getCart();

    // 2. generate the line items
    let lineItems = [];
    let meta = [];
    for (let item of items) {
        const lineItem = {
            'name': item.related('products').related('essentialoil').get('name'),
            'amount': item.related('products').get('price'), // in cents!
            'quantity': item.get('item_quantity'),
            'currency': 'SGD'
        }
        // include image
        if (item.related('products').get('image')) {
            lineItem['images'] = [ item.related('products').get('image')]
        }
        lineItems.push(lineItem);
        meta.push({
            'product_id': item.get('product_id'),
            'quantity': item.get('item_quantity')
        })
    }

    console.log("line items: ",lineItems);

    // 3. send the line items to Stripe and get a stripe payment id
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        // success_url: 'https://www.google.com/' + "?sessionId={CHECKOUT_SESSION_ID}",
        // cancel_url: 'https://www.straitstimes.com/',
        success_url: process.env.STRIPE_SUCCESS_URL + "?sessionId={CHECKOUT_SESSION_ID}",
        cancel_url: process.env.STRIPE_CANCELLED_URL,
        metadata:{
            'orders': metaData
        }
    }

    console.log("payment:", payment);

    // 4. register the payment
    let stripeSession = await stripe.checkout.sessions.create(payment);

    // 5. send payment id to a hbs file
    res.render('checkout/checkout',{
        'sessionId': stripeSession.id,
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    });
});

router.get('/success', function(req,res){
    res.send('Payment successful');
});

router.get('/cancelled', function(req,res){
    res.send("Payment has been cancelled")
});



// this is the webhook route
// stripe will send a POST request to this route when a
// payment is completed
router.post('/process_payment', express.raw({
    'type':'application/json'
}), function(req,res){
    let payload = req.body;
    // console.log(payload)
    
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    // console.log(endpointSecret)
    
    let sigHeader = req.headers['stripe-signature'];
    console.log(sigHeader)
    
    let event;
    try {
        event = stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);
    } catch(e) {
        res.send({
            "error": e.message
        })
        console.log(e.message)
    }
    console.log(event)
    if (event.type === 'checkout.session.completed') {
        let stripeSession = event.data.object;
        console.log(stripeSession)
    }
    res.send({
        'recieved': true
    })
})


module.exports = router;