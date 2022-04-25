const express = require("express");
const router = express.Router();

// import in the Product model
const { Essentialoil } = require('../models')

router.get('/', async (req,res) => {
    // fetch all the essential oils (ie, SELECT * from essentialOils)
    let essential_oils = await Essentialoil.collection().fetch();
    res.render('products/index', {
        'essential_oils': essential_oils.toJSON() // convert collection to JSON
    })
})

module.exports = router;