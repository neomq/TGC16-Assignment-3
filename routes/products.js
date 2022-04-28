const express = require("express");
const router = express.Router();

// import in the Product model
const { Products, Note, Size, Essentialoils, Scent, Usage, Benefit } = require('../models');

// import in the Forms
const { bootstrapField, createProductForm, createEssentialoilForm } = require('../forms');

// GET PRODUCTS
router.get('/', async (req, res) => {
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
router.get('/create', async (req, res) => {
    
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
        'form': productForm.toHTML(bootstrapField)
    })
})
// process submitted form
router.post('/create', async(req, res) => {

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
    
    productForm.handle(req, {
        'success': async (form) => {
            
            let {scent, usage, benefit, ...productData} = form.data;
            const product = new Products(productData);
            
            // essentialoil.set('image', form.data.image);
            // essentialoil.set('price', form.data.price);
            // essentialoil.set('size', form.data.size);
            // essentialoil.set('stock', form.data.stock);
            // essentialoil.set('note_id', form.data.note_id);
            // essentialoil.set('size_id', form.data.size_id);
            
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
router.get('/:product_id/update', async (req, res) => {
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
        'product': product.toJSON()
    })

})
// process update
router.post('/:product_id/update', async (req, res) => {

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
router.get('/:product_id/delete', async(req,res)=>{
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
router.post('/:product_id/delete', async(req,res)=>{
    // fetch the product that we want to delete
    const product = await Products.where({
        'id': req.params.product_id
    }).fetch({
        require: true,
        withRelated:['essentialoil']
    });
    await product.destroy();
    res.redirect('/products')
})

// // GET ESSENTIAL OILS
router.get('/essential-oils', async (req, res) => {
    // fetch all the essential oils (ie, SELECT * from essentialOils)
    let essentialoils = await Essentialoils.collection().fetch({
        withRelated:['products']
    });
    // console.log(essentialoils.toJSON())
    res.render('essentialoils/index', {
        'essentialoils': essentialoils.toJSON()
    })
})

// CREATE ESSENTIAL OILS
// render create form
router.get('/essential-oils/create', async (req, res) => {
    
    const essentialoilForm = createEssentialoilForm();
    
    res.render('essentialoils/create', {
        'form': essentialoilForm.toHTML(bootstrapField)
    })
})




module.exports = router;