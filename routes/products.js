const express = require("express");
const router = express.Router();

// import in the Product model
const { Products, Note, Size, Essentialoils, Scent } = require('../models');

// import in the Forms
const { bootstrapField, createProductForm } = require('../forms');

router.get('/', async (req, res) => {
    // fetch all the essential oils (ie, SELECT * from essentialOils)
    let products = await Products.collection().fetch({
        withRelated:['note', 'size', 'essentialoil', 'scent']
    });
    res.render('products/index', {
        'products': products.toJSON()
    })
    console.log(products.toJSON())
})

// CREATE
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

    const productForm = createProductForm(allNotes, allSizes, allEssentialOils, allScents);
    
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

    const productForm = createProductForm(allNotes, allSizes, allEssentialOils, allScents);
    
    productForm.handle(req, {
        'success': async (form) => {
            
            let {scent, ...productData} = form.data;
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

            res.redirect('/essential-oils');
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

//UPDATE
router.get('/:product_id/update', async (req, res) => {
    // retrieve the product
    const productId = req.params.product_id
    const product = await Products.where({
        'id': productId
    }).fetch({
        require: true,
        withRelated:['scent']
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

    const productForm = createProductForm(allNotes, allSizes, allEssentialOils, allScents);

    // fill in the existing values
    productForm.fields.price.value = product.get('price');
    productForm.fields.stock.value = product.get('stock');

    productForm.fields.note_id.value = product.get('note_id');
    productForm.fields.size_id.value = product.get('size_id');
    productForm.fields.essentialOil_id.value = product.get('essentialOil_id');

    // fill in the multi-select for the scents
    let selectedScents = await product.related('scent').pluck('id');
    productForm.fields.scent.value = selectedScents;

    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': product.toJSON()
    })

})

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

    // fetch the product that we want to update
    const product = await Products.where({
        'id': req.params.product_id
    }).fetch({
        require: true,
        withRelated:['scent']
    });

    // process the form
    const productForm = createProductForm(allNotes, allSizes, allEssentialOils, allScents);
    productForm.handle(req, {
        'success': async (form) => {
            let { scent, ...productData } = form.data;
            product.set(productData);
            product.save();

            let scentIds = scent.split(',');
            let existingScentIds = await product.related('scent').pluck('id');
            // remove all the tags that aren't selected anymore
            let toRemove = existingScentIds.filter(id => scentIds.includes(id) === false);
            await product.scent().detach(toRemove);
            // add in all the tags selected in the form
            await product.scent().attach(scentIds);

            res.redirect('/essential-oils');
        },
        'error': async (form) => {
            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': product.toJSON()
            })
        }
    })
})

module.exports = router;