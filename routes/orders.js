const express = require("express")
const router = express.Router()

// import in the Models
const { Orders, Orderstatus, Orderdetails } = require("../models")

// import in the Forms
const { bootstrapField, bootstrapFieldcol3, createSearchOrderForm, createOrderUpdateStatusForm, createOrderUpdateAddressForm } = require('../forms');

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require('../middlewares');

// GET ALL ORDERS
router.get("/", checkIfAuthenticated, async (req, res) => {

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

// UPDATE ORDERS
router.get('/:order_id/update', checkIfAuthenticated, async (req, res) => {
    
    // retrieve the orders
    const order = await Orders.where({
        'id': req.params.order_id
    }).fetch({
        require: true,
        withRelated:['orderstatus',
                    'orderdetails',
                    'orderdetails.products',
                    'orderdetails.products.size',
                    'orderdetails.products.essentialoil',
                    'user']
    });

    const allOrderStatuses = await Orderstatus.fetchAll().map((status) => {
        return [status.get('id'), status.get('status')];
    })
    
    // update order status
    const updateOrderStatusForm = createOrderUpdateStatusForm(allOrderStatuses);
    // fill in existing order status
    updateOrderStatusForm.fields.order_status_id.value = order.get('order_status_id');

    // update order shipping address
    const updateOrderAddressForm = createOrderUpdateAddressForm();
    // fill in existing shipping address
    updateOrderAddressForm.fields.shipping_address.value = order.get('shipping_address');

    // format order date / time
    let orderToUpdate = order.toJSON()
    let order_date_formatted = orderToUpdate.date.toString().split(' G')[0]
    orderToUpdate.date_formatted = order_date_formatted

    res.render('orders/update', {
        'statusform': updateOrderStatusForm.toHTML(bootstrapField),
        'addressform': updateOrderAddressForm.toHTML(bootstrapField),
        'order': orderToUpdate
    })

})
// process update
router.post('/:order_id/update', checkIfAuthenticated, async (req, res) => {
    
    // retrieve the order to update
    const order = await Orders.where({
        'id': req.params.order_id
    }).fetch({
        require: true,
        withRelated:['orderstatus',
                    'orderdetails',
                    'orderdetails.products',
                    'orderdetails.products.size',
                    'orderdetails.products.essentialoil',
                    'user']
    });

    const allOrderStatuses = await Orderstatus.fetchAll().map((status) => {
        return [status.get('id'), status.get('status')];
    })

    // format order date / time
    let orderToUpdate = order.toJSON()
    let order_date_formatted = orderToUpdate.date.toString().split(' G')[0]
    orderToUpdate.date_formatted = order_date_formatted

    // update order status
    const updateOrderStatusForm = createOrderUpdateStatusForm(allOrderStatuses);
    updateOrderStatusForm.handle(req, {
        'success': async (form) => {
            order.set(form.data);
            order.save();
        },
        'error': async (form) => {
            res.render('orders/update', {
                'form': form.toHTML(bootstrapField),
                'order': orderToUpdate
            })
        }
    })

    // update order address
    const updateOrderAddressForm = createOrderUpdateAddressForm();
    updateOrderAddressForm.handle(req, {
        'success': async (form) => {
            order.set(form.data);
            order.save();

            req.flash("success_messages", `Order has been updated!`)
            res.redirect('/aromaadmin/orders');
        },
        'error': async (form) => {
            res.render('orders/update', {
                'form': form.toHTML(bootstrapField),
                'order': orderToUpdate
            })
        }
    })
})

// DELETE ORDERS
router.get('/:order_id/delete', checkIfAuthenticated, async(req,res)=>{
    
    // fetch the order to delete
    const order = await Orders.where({
        'id': req.params.order_id
    }).fetch({
        require: true,
        withRelated:['orderstatus', 'user', 'orderdetails']
    });

    // format order date / time
    let orderToDelete = order.toJSON()
    let order_date_formatted = orderToDelete.date.toString().split(' G')[0]
    orderToDelete.date_formatted = order_date_formatted

    res.render('orders/delete', {
        'order': orderToDelete
    })
});
// process delete
router.post('/:order_id/delete', checkIfAuthenticated, async(req,res)=>{
    
    // fetch the order to delete
    const order = await Orders.where({
        'id': req.params.order_id
    }).fetch({
        require: true,
        withRelated:['orderstatus', 'user', 'orderdetails']
    });

    // fetch the order details of the order
    const orderDetail = await Orderdetails.where({
        'order_id': req.params.order_id
    }).fetch({
        require: true
    });
    
    // Delete the order and order details
    await order.destroy();
    await orderDetail.destroy;

    req.flash("success_messages", `Order has been deleted`)
    res.redirect('/aromaadmin/orders')
})


module.exports = router;