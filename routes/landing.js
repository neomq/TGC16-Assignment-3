const express = require("express");

// Create a new express Router
const router = express.Router(); 

// Add routes to the Express router
router.get('/', (req,res)=>{
    res.render('landing/index')
})

// export out the router
module.exports = router; 