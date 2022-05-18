const express = require("express");
const router = express.Router();

// import in the Product model
const { Products, Essentialoils } = require('../models');

// import in the Forms
const { bootstrapField, bootstrapFieldcol3, createProductForm, createEssentialoilForm, createSearchProductForm } = require('../forms');

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require('../middlewares');

// import in the DAL
const dataLayer = require('../dal/products')

// GET ALL PRODUCTS
router.get('/', checkIfAuthenticated, async (req, res) => {
    
    const allItemTypes = await dataLayer.allItemTypes();
    const allSizes = await dataLayer.allSizes();
    const allEssentialOils = await dataLayer.allEssentialOils();
    const allScents = await dataLayer.allScents();
    const allUsages = await dataLayer.allUsages();
    const allBenefits = await dataLayer.allBenefits();

    // Create Product Search
   let searchProduct = createSearchProductForm(allEssentialOils, allSizes, allItemTypes, allScents, allUsages, allBenefits);
   let q = Products.collection();

   // Add empty option to select field
   allItemTypes.unshift([0, '---']);
   allSizes.unshift([0, '---']);
   allEssentialOils.unshift([0, '---']);

   searchProduct.handle(req, {
       'empty': async (form) => {
           let products = await q.fetch({
               withRelated: ['itemtype', 'essentialoil', 'scent', 'usage', 'benefit', 'size']
           })
           console.log(products.toJSON())
           res.render('products/index', {
               'products': products.toJSON(),
               'form': form.toHTML(bootstrapFieldcol3)
           })
       },
       'error': async (form) => {
           let products = await q.fetch({
               withRelated: ['itemtype', 'essentialoil', 'scent', 'usage', 'benefit', 'size']
           })
           res.render('products/index', {
               'products': products.toJSON(),
               'form': form.toHTML(bootstrapFieldcol3)
           })
       },
       'success': async (form) => {
           if (form.data.essentialoil_id && form.data.essentialoil_id != "0") {
               q = q.where('essentialoil_id', 'like', req.query.essentialoil_id)
           }
           if (form.data.min_price) {
               q = q.where('price', '>=', req.query.min_price)
           }
           if (form.data.max_price) {
               q = q.where('price', '<=', req.query.max_price);
           }
           if (form.data.size_id && form.data.size_id != "0") {
               q = q.where('size_id', '=', req.query.size_id)
           }
           if (form.data.item_type_id && form.data.item_type_id != "0") {
               q = q.where('item_type_id', '=', req.query.item_type_id)
           }
           if (form.data.scent) {
               q = q.query('join', 'products_scent', 'products.id', 'products_scent.product_id')
                   .where('scent_id', 'in', form.data.scent.split(','))
           }
           if (form.data.usages) {
               q = q.query('join', 'products_usages', 'products.id', 'products_usages.product_id')
                   .where('usage_id', 'in', form.data.usages.split(','))
           }
           if (form.data.benefits) {
               q = q.query('join', 'benefits_products', 'products.id', 'benefits_products.product_id')
                   .where('benefit_id', 'in', form.data.benefits.split(','))
           }
           let products = await q.fetch({
               withRelated: ['itemtype', 'essentialoil', 'scent', 'usage', 'benefit', 'size']
           })
           //console.log(products.toJSON())
           res.render('products/index', {
               'products': products.toJSON(),
               'form': form.toHTML(bootstrapFieldcol3)
           })
       }
   })

})

// CREATE PRODUCTS
// render create form
router.get('/create', checkIfAuthenticated, async (req, res) => {
    
    const allItemTypes = await dataLayer.allItemTypes();
    const allSizes = await dataLayer.allSizes();
    const allEssentialOils = await dataLayer.allEssentialOils();
    const allScents = await dataLayer.allScents();
    const allUsages = await dataLayer.allUsages();
    const allBenefits = await dataLayer.allBenefits();

    const productForm = createProductForm(allItemTypes, allSizes, allEssentialOils, allScents, allUsages, allBenefits);
    
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})
// process submitted form
router.post('/create', checkIfAuthenticated, async(req, res) => {

    const allItemTypes = await dataLayer.allItemTypes();
    const allSizes = await dataLayer.allSizes();
    const allEssentialOils = await dataLayer.allEssentialOils();
    const allScents = await dataLayer.allScents();
    const allUsages = await dataLayer.allUsages();
    const allBenefits = await dataLayer.allBenefits();

    const productForm = createProductForm(allItemTypes, allSizes, allEssentialOils, allScents, allUsages, allBenefits);
    console.log(productForm)
    
    productForm.handle(req, {
        'success': async (form) => {
            
            let {scent, usage, benefit, ...productData} = form.data;
            const product = new Products(productData);
            //console.log(product)
            await product.save();

            if (scent) {
                await product.scent().attach(scent.split(","));
            }
            if (usage) {
                await product.usage().attach(usage.split(","));
            }
            if (benefit) {
                await product.benefit().attach(benefit.split(","));
            }

            req.flash("success_messages", `New Product has been created`)
            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

// UPDATE PRODUCTS
router.get('/:product_id/update', checkIfAuthenticated, async (req, res) => {
    // retrieve the product
    const productId = req.params.product_id
    const product = await dataLayer.getProductByID(productId);

    const allItemTypes = await dataLayer.allItemTypes();
    const allSizes = await dataLayer.allSizes();
    const allEssentialOils = await dataLayer.allEssentialOils();
    const allScents = await dataLayer.allScents();
    const allUsages = await dataLayer.allUsages();
    const allBenefits = await dataLayer.allBenefits();

    const productForm = createProductForm(allItemTypes, allSizes, allEssentialOils, allScents, allUsages, allBenefits);

    // fill in the existing values
    productForm.fields.price.value = product.get('price');
    productForm.fields.stock.value = product.get('stock');
    productForm.fields.item_type_id.value = product.get('item_type_id');
    productForm.fields.size_id.value = product.get('size_id');
    productForm.fields.essentialoil_id.value = product.get('essentialoil_id');

    // set the image in the product form
    productForm.fields.image.value = product.get('image');

    // fill in the multi-select for the scents
    let selectedScents = await product.related('scent').pluck('id');
    productForm.fields.scent.value = selectedScents;

    // fill in the multi-select for usages
    let selectedUsages = await product.related('usage').pluck('id');
    productForm.fields.usage.value = selectedUsages;

    // fill in the multi-select for benefits
    let selectedBenefits = await product.related('benefit').pluck('id');
    productForm.fields.benefit.value = selectedBenefits;

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON(),
        // send to the HBS file the cloudinary information
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })

})
// process update
router.post('/:product_id/update', checkIfAuthenticated, async (req, res) => {
    
    // fetch the product that we want to update
    const productId = req.params.product_id
    const product = await dataLayer.getProductByID(productId);

    const allItemTypes = await dataLayer.allItemTypes();
    const allSizes = await dataLayer.allSizes();
    const allEssentialOils = await dataLayer.allEssentialOils();
    const allScents = await dataLayer.allScents();
    const allUsages = await dataLayer.allUsages();
    const allBenefits = await dataLayer.allBenefits();

    // process the form
    const productForm = createProductForm(allItemTypes, allSizes, allEssentialOils, allScents, allUsages, allBenefits);
    productForm.handle(req, {
        'success': async (form) => {
            let { scent, usage, benefit, ...productData } = form.data;
            product.set(productData);
            product.save();

            let scentIds = scent.split(',');
            let existingScentIds = await product.related('scent').pluck('id');
            // remove all the tags that aren't selected anymore
            let toRemoveScent = existingScentIds.filter(id => scentIds.includes(id) === false);
            await product.scent().detach(toRemoveScent);
            // add in all the tags selected in the form
            await product.scent().attach(scentIds);

            let usageIds = usage.split(',');
            let existingUsageIds = await product.related('usage').pluck('id');
            // remove all the tags that aren't selected anymore
            let toRemoveUsage = existingUsageIds.filter(id => usageIds.includes(id) === false);
            await product.usage().detach(toRemoveUsage);
            // add in all the tags selected in the form
            await product.usage().attach(usageIds);

            let benefitIds = benefit.split(',');
            let existingBenefitIds = await product.related('benefit').pluck('id');
            // remove all the tags that aren't selected anymore
            let toRemoveBenefit = existingBenefitIds.filter(id => benefitIds.includes(id) === false);
            await product.benefit().detach(toRemoveBenefit);
            // add in all the tags selected in the form
            await product.benefit().attach(benefitIds);

            req.flash("success_messages", `Product has been updated!`)

            res.redirect('/products');
        },
        'error': async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON()
            })
        }
    })
})

// DELETE PRODUCTS
router.get('/:product_id/delete', checkIfAuthenticated, async(req,res)=>{
    
    // fetch the product that we want to delete
    const productId = req.params.product_id
    const product = await dataLayer.getProductByID(productId);

    console.log(product.toJSON())
  
    let productToDelete = product.toJSON()

    let alert = ""
    // if product exists in shopping cart / orders
    if(productToDelete.cartitem.length > 0 || productToDelete.orderdetails.length > 0){
        alert = "You cannot delete a product that has purchases!"
      }
    
    res.render('products/delete', {
        'product': product.toJSON(),
        'alert': alert
    })
});
// process delete
router.post('/:product_id/delete', checkIfAuthenticated, async(req,res)=>{
    
    // fetch the product that we want to delete
    const productId = req.params.product_id
    const product = await dataLayer.getProductByID(productId);
    
    await product.destroy();

    req.flash("success_messages", `Product has been deleted!`)
    res.redirect('/products')
})

// GET ALL ESSENTIAL OILS
router.get('/essential-oils', checkIfAuthenticated, async (req, res) => {
    // fetch all the essential oils (ie, SELECT * from essentialOils)
    let essentialoils = await Essentialoils.collection().fetch();
    console.log(essentialoils.toJSON())
    res.render('essentialoils/index', {
        'essentialoils': essentialoils.toJSON()
    })
})

// CREATE ESSENTIAL OILS
// render create form
router.get('/essential-oils/create', checkIfAuthenticated, async (req, res) => {
    
    const essentialoilForm = createEssentialoilForm();
    
    res.render('essentialoils/create', {
        'form': essentialoilForm.toHTML(bootstrapField)
    })
})
// process create
router.post('/essential-oils/create', checkIfAuthenticated, async(req, res) => {

    const essentialoilForm = createEssentialoilForm();
    
    essentialoilForm.handle(req, {
        'success': async (form) => {
            
            const essentialoil = new Essentialoils(form.data);
            await essentialoil.save();

            req.flash("success_messages", `Essential oil has been created!`)

            res.redirect('/products/essential-oils');
        },
        'error': async (form) => {
            res.render('essentialoils/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

// UPDATE ESSENTIAL OILS
router.get('/essential-oils/:essentialoil_id/update', checkIfAuthenticated, async (req, res) => {
    // retrieve the product
    const essentialoilId = req.params.essentialoil_id
    const essentialoil = await dataLayer.getEssentialOilByID(essentialoilId);

    const essentialoilForm = createEssentialoilForm();

    // fill in the existing values
    essentialoilForm.fields.name.value = essentialoil.get('name');
    essentialoilForm.fields.description.value = essentialoil.get('description');
    essentialoilForm.fields.application.value = essentialoil.get('application');
    essentialoilForm.fields.directions.value = essentialoil.get('directions');
    essentialoilForm.fields.beauty_benefits.value = essentialoil.get('beauty_benefits');
    essentialoilForm.fields.body_benefits.value = essentialoil.get('body_benefits');
    essentialoilForm.fields.emotional_benefits.value = essentialoil.get('emotional_benefits');

    res.render('essentialoils/update', {
        'form': essentialoilForm.toHTML(bootstrapField),
        'essentialoil': essentialoil.toJSON()
    })

})
// process update
router.post('/essential-oils/:essentialoil_id/update', checkIfAuthenticated, async (req, res) => {

    // fetch the product that we want to update
    const essentialoilId = req.params.essentialoil_id
    const essentialoil = await dataLayer.getEssentialOilByID(essentialoilId);
    
    // process the form
    const essentialoilForm = createEssentialoilForm();
    
    essentialoilForm.handle(req, {
        'success': async (form) => {

            essentialoil.set(form.data);
            essentialoil.save();

            req.flash("success_messages", `Essential oil has been updated!`)

            res.redirect('/products/essential-oils');
        },
        'error': async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON()
            })
        }
    })
})

// DELETE ESSENTIAL OILS
router.get('/essential-oils/:essentialoil_id/delete', checkIfAuthenticated, async(req,res)=>{
    
    // fetch the product that we want to delete
    const essentialoilId = req.params.essentialoil_id
    const essentialoil = await dataLayer.getEssentialOilByID(essentialoilId);

    // console.log(essentialoil.toJSON())

    let oil = essentialoil.toJSON()
    let alert = ""
    if(oil.products.length > 0){
        alert = "You cannot delete an essential oil that has been created in the product database!"
    }

    res.render('essentialoils/delete', {
        'essentialoil': essentialoil.toJSON(),
        'alert': alert
    })
});
// process delete
router.post('/essential-oils/:essentialoil_id/delete', checkIfAuthenticated, async(req,res)=>{
    
    // fetch the product that we want to delete
    const essentialoilId = req.params.essentialoil_id
    const essentialoil = await dataLayer.getEssentialOilByID(essentialoilId);

    await essentialoil.destroy();

    req.flash("success_messages", `Essential oil has been deleted!`)

    res.redirect('/products/essential-oils')
})


module.exports = router;