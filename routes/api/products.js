const express = require('express')
const router = express.Router();
const { Products } = require("../../models")

const productDataLayer = require('../../dal/products')

// get all products
router.get('/', async (req, res) => {

    // res.send(await productDataLayer.getAllProducts())
    let allProducts = await productDataLayer.getAllProducts()
    let displayAllProducts = allProducts.toJSON()

    // display product price in SGD
    for (let p of displayAllProducts) {
        let price_sgd = (p.price / 100).toFixed(2)
        p.price_sgd = price_sgd
    }
    // console.log(displayProducts)
    res.send(displayAllProducts)
})

// get product types
router.get('/types', async (req, res) => {
    let allTypes = await productDataLayer.allItemTypes()
    res.send(allTypes)
})

// get product usages
router.get('/usages', async (req, res) => {
    let allUsages = await productDataLayer.allUsages()
    res.send(allUsages)
})

// get scent profiles
router.get('/scents', async (req, res) => {
    let allScents = await productDataLayer.allScents()
    res.send(allScents)
})

// get product benefits
router.get('/benefits', async (req, res) => {
    let allBenefits = await productDataLayer.allBenefits()
    res.send(allBenefits)
})

// get individual product by id
router.get('/:product_id', async (req, res) => {
    const productId = req.params.product_id
    const eachProduct = await productDataLayer.getProductByID(productId);

    let displayEachProduct = eachProduct.toJSON()
    
    // display product price in SGD
    let price_sgd = (displayEachProduct.price / 100).toFixed(2)
    displayEachProduct.price_sgd = price_sgd
    
    res.send(displayEachProduct)
})

// search products
router.post("/search", async (req, res) => {
    let q = Products.collection();

    // search by product name
    if (req.body.name) {
        q = q.query('join', 'essentialoils', 'essentialoils.id', 'products.essentialoil_id')
            .where('essentialoils.name', 'ilike', '%' + req.body.name + '%')
    }

    // filter by product type
    if (req.body.type) {
        q = q.query('join', 'item_type', 'item_type.id', 'products.item_type_id')
            .where('item_type.name', 'like', req.body.type)
    }

    // filter by usage
    if (req.body.use) {
        q = q.query('join', 'products_usages', 'products.id', 'products_usages.product_id')
             .where('usage_id', 'in', req.body.use)
    }

    // filter by scent profile
    if (req.body.scent) {
        q = q.query('join', 'products_scent', 'products.id', 'products_scent.product_id')
            .where('scent_id', 'in', req.body.scent)
    }

    // // filter by benefits
    if (req.body.benefits) {
        q = q.query('join', 'benefits_products', 'products.id', 'benefits_products.product_id')
            .where('benefit_id', 'in', req.body.benefits)
    }

    let results = await q.fetch({
        withRelated: ['itemtype', 'essentialoil', 'scent', 'usage', 'benefit', 'size']
    })

    // display price in sgd
    let displaySearchResults = results.toJSON()

    // display product price in SGD
    for (let p of displaySearchResults) {
        let price_sgd = (p.price / 100).toFixed(2)
        p.price_sgd = price_sgd
    }
    // console.log(displayProducts)
    res.send(displaySearchResults)
})

module.exports = router;
