const express = require("express");
const router = express.Router();

// import in the Product model
const { Products, Note, Size, Essentialoils, Scent, Usage, Benefit } = require('../models');

// import in the Forms
const { bootstrapField, createProductForm, createEssentialoilForm } = require('../forms');

// import in the CheckIfAuthenticated middleware
const { checkIfAuthenticated } = require('../middlewares');

// GET PRODUCTS
router.get('/', checkIfAuthenticated, async (req, res) => {
    // fetch all the essential oils (ie, SELECT * from essentialOils)
    let products = await Products.collection().fetch({
        withRelated:['note', 'size', 'essentialoil', 'scent', 'usage', 'benefit']
    });
    console.log(products.toJSON())
    res.render('products/index', {
        'products': products.toJSON()
    })
})

// CREATE PRODUCTS
// render create form
router.get('/create', checkIfAuthenticated, async (req, res) => {
    
    const allNotes = await Note.fetchAll().map((n) => {
        return [n.get('id'), n.get('name')];
    })
    const allSizes = await Size.fetchAll().map((s) => {
        return [s.get('id'), s.get('size')];
    })
    const allEssentialOils = await Essentialoils.fetchAll().map((e) => {
        return [e.get('id'), e.get('name')];
    })
    
    const allScents = await Scent.fetchAll().map( scent => [scent.get('id'), scent.get('type')]);
    const allUsages = await Usage.fetchAll().map( usage => [usage.get('id'), usage.get('type')]);
    const allBenefits = await Benefit.fetchAll().map( benefit => [benefit.get('id'), benefit.get('type')]);

    const productForm = createProductForm(allNotes, allSizes, allEssentialOils, allScents, allUsages, allBenefits);
    
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})
// process submitted form
router.post('/create', checkIfAuthenticated, async(req, res) => {

    const allNotes = await Note.fetchAll().map((n) => {
        return [n.get('id'), n.get('name')];
    })
    const allSizes = await Size.fetchAll().map((s) => {
        return [s.get('id'), s.get('size')];
    })
    const allEssentialOils = await Essentialoils.fetchAll().map((e) => {
        return [e.get('id'), e.get('name')];
    })
    const allScents = await Scent.fetchAll().map( scent => [scent.get('id'), scent.get('type')]);
    const allUsages = await Usage.fetchAll().map( usage => [usage.get('id'), usage.get('type')]);
    const allBenefits = await Benefit.fetchAll().map( benefit => [benefit.get('id'), benefit.get('type')]);

    const productForm = createProductForm(allNotes, allSizes, allEssentialOils, allScents, allUsages, allBenefits);

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

            req.flash("success_messages", `New Product ${product.get('essentialOil_id')} has been created`)

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
    const product = await Products.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated:['essentialoil', 'scent', 'usage', 'benefit']
    });

    const allNotes = await Note.fetchAll().map((n) => {
        return [n.get('id'), n.get('name')];
    })
    const allSizes = await Size.fetchAll().map((s) => {
        return [s.get('id'), s.get('size')];
    })
    const allEssentialOils = await Essentialoils.fetchAll().map((e) => {
        return [e.get('id'), e.get('name')];
    })

    const allScents = await Scent.fetchAll().map( scent => [scent.get('id'), scent.get('type')]);
    const allUsages = await Usage.fetchAll().map( usage => [usage.get('id'), usage.get('type')]);
    const allBenefits = await Benefit.fetchAll().map( benefit => [benefit.get('id'), benefit.get('type')]);

    const productForm = createProductForm(allNotes, allSizes, allEssentialOils, allScents, allUsages, allBenefits);

    // fill in the existing values
    productForm.fields.price.value = product.get('price');
    productForm.fields.stock.value = product.get('stock');

    productForm.fields.note_id.value = product.get('note_id');
    productForm.fields.size_id.value = product.get('size_id');
    productForm.fields.essentialOil_id.value = product.get('essentialOil_id');

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

    const allNotes = await Note.fetchAll().map((n) => {
        return [n.get('id'), n.get('name')];
    })
    const allSizes = await Size.fetchAll().map((s) => {
        return [s.get('id'), s.get('size')];
    })
    const allEssentialOils = await Essentialoils.fetchAll().map((e) => {
        return [e.get('id'), e.get('name')];
    })

    const allScents = await Scent.fetchAll().map( scent => [scent.get('id'), scent.get('type')]);
    const allUsages = await Usage.fetchAll().map( usage => [usage.get('id'), usage.get('type')]);
    const allBenefits = await Benefit.fetchAll().map( benefit => [benefit.get('id'), benefit.get('type')]);

    // fetch the product that we want to update
    const product = await Products.where({
        'id': req.params.product_id
    }).fetch({
        require: true,
        withRelated:['essentialoil', 'scent', 'usage', 'benefit']
    });

    // process the form
    const productForm = createProductForm(allNotes, allSizes, allEssentialOils, allScents, allUsages, allBenefits);
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
    const product = await Products.where({
        'id': req.params.product_id
    }).fetch({
        require: true,
        withRelated:['essentialoil']
    });
    res.render('products/delete', {
        'product': product.toJSON()
    })
});
// process delete
router.post('/:product_id/delete', checkIfAuthenticated, async(req,res)=>{
    // fetch the product that we want to delete
    const product = await Products.where({
        'id': req.params.product_id
    }).fetch({
        require: true,
        withRelated:['essentialoil']
    });
    await product.destroy();

    req.flash("success_messages", `Product has been deleted!`)

    res.redirect('/products')
})

// GET ESSENTIAL OILS
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
// process submitted form
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
    const essentialoil = await Essentialoils.where({
        'id': essentialoilId
    }).fetch({
        require: true
    });

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
    const essentialoil = await Essentialoils.where({
        'id': req.params.essentialoil_id
    }).fetch({
        require: true,
    });
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
    const essentialoil = await Essentialoils.where({
        'id': req.params.essentialoil_id
    }).fetch({
        require: true
    });

    res.render('essentialoils/delete', {
        'essentialoil': essentialoil.toJSON()
    })
});
// process delete
router.post('/essential-oils/:essentialoil_id/delete', checkIfAuthenticated, async(req,res)=>{
    // fetch the product that we want to delete
    const essentialoil = await Essentialoils.where({
        'id': req.params.essentialoil_id
    }).fetch({
        require: true
    });
    await essentialoil.destroy();

    req.flash("success_messages", `Essential oil has been deleted!`)

    res.redirect('/products/essential-oils')
})


module.exports = router;