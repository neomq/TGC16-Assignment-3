const express = require("express")
const router = express.Router()

// import in the Models
const { Orders, Orderstatus, Orderdetails } = require("../models")

// GET ALL ORDERS
router.get("/", async (req, res) => {

    let orders = await Orders.collection().fetch({
        withRelated: ['user', 'orderstatus', 'orderdetails']
    })
    
    let allOrders = orders.toJSON()

    // format order date / time
    for (let order of allOrders) {
        let order_date_formatted = order.date.toString().split(' G')[0]
        order.date_formatted = order_date_formatted
    }

    //console.log(allOrders)

    res.render('orders/index', {
        'orders': allOrders
    })

})


module.exports = router;