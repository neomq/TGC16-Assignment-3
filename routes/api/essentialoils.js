const express = require('express')
const router = express.Router();

const productDataLayer = require('../../dal/products')

// get essential oil by id
router.get('/:eo_id', async (req, res) => {
    const essentialOilsId = req.params.eo_id
    const eachEssentialOil = await productDataLayer.getEssentialOilByID(essentialOilsId);

    res.send(eachEssentialOil)
})

module.exports = router;
