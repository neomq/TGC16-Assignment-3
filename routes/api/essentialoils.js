const express = require('express')
const router = express.Router()

const productDataLayer = require('../../dal/products')

// get essential oil by id
router.get('/:eo_id', async (req, res) => {
    const essentialOilsId = req.params.eo_id
    const eachEssentialOil = await productDataLayer.getEssentialOilByID(essentialOilsId)

    let eoProduct = eachEssentialOil.toJSON()

    // display product price in SGD
    eoProduct.products.forEach(product => (
        product.price_sgd = (product.price / 100).toFixed(2)
    ))

    res.send(eoProduct)
})

module.exports = router;
