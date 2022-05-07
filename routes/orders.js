const express = require("express")
const router = express.Router()

// import in the Models
const { Orders, Orderstatus, Orderdetails } = require("../models")

// import in the Forms
const { bootstrapFieldcol3, createSearchOrderForm } = require('../forms');

// GET ALL ORDERS
router.get("/", async (req, res) => {

    const allOrderStatuses = await Orderstatus.fetchAll().map((status) => {
        return [status.get('id'), status.get('status')];
    })

    // Create Order Search
    let searchOrder = createSearchOrderForm(allOrderStatuses);
    let q = Orders.collection();

    // Add empty option to order status select
    allOrderStatuses.unshift([0, '---']);

    searchOrder.handle(req, {
        'empty': async (form) => {
            let orders = await q.fetch({
                withRelated: ['user', 'orderstatus', 'orderdetails']
            })
            
            // format order date / time
            let allOrders = orders.toJSON()
            for (let order of allOrders) {
                let order_date_formatted = order.date.toString().split(' G')[0]
                order.date_formatted = order_date_formatted
            }
            console.log(allOrders)
            res.render('orders/index', {
                'orders': allOrders,
                'form': form.toHTML(bootstrapFieldcol3)
            })
        },
        'error': async (form) => {
            let orders = await q.fetch({
                withRelated: ['user', 'orderstatus', 'orderdetails']
            })
            
            // format order date / time
            let allOrders = orders.toJSON()
            for (let order of allOrders) {
                let order_date_formatted = order.date.toString().split(' G')[0]
                order.date_formatted = order_date_formatted
            }
            res.render('orders/index', {
                'orders': allOrders,
                'form': form.toHTML(bootstrapFieldcol3)
            })
           
        },
        'success': async (form) => {
            if (form.data.name) {
                q = q.query('join', 'users', 'user_id', 'users.id')
                        .where('users.name', 'like', '%' + req.query.name + '%')
            }
            if (form.data.email) {
                q = q.query('join', 'users', 'user_id', 'users.id')
                        .where('users.email', 'like', '%' + req.query.email + '%')
            }
            if (form.data.shipping_address) {
                q = q.where('shipping_address', 'like', '%' + req.query.shipping_address + '%')
            }
            if (form.data.order_status_id && form.data.order_status_id != "0") {
                q = q.where('order_status_id', '=', req.query.order_status_id)
            }
            let orders = await q.fetch({
                withRelated: ['user', 'orderstatus', 'orderdetails']
            })
            
            // format order date / time
            let allOrders = orders.toJSON()
            for (let order of allOrders) {
                let order_date_formatted = order.date.toString().split(' G')[0]
                order.date_formatted = order_date_formatted
            }
            res.render('orders/index', {
                'orders': allOrders,
                'form': form.toHTML(bootstrapFieldcol3)
            })
        }
    })

})


module.exports = router;