const express = require("express");
const router = express.Router();

// import in the Product model
const { Products, Note, Size, Essentialoils } = require('../models');

// import in the Forms
const { bootstrapField, createProductForm } = require('../forms');

router.get('/', async (req, res) => {
    // fetch all the essential oils (ie, SELECT * from essentialOils)
    let products = await Products.collection().fetch({
        withRelated:['note', 'size', 'essentialoil']
    });
    res.render('products/index', {
        'products': products.toJSON() // convert collection to JSON
    })
    console.log(products.toJSON())
})

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

    const productForm = createProductForm(allNotes, allSizes, allEssentialOils);
    
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

    const productForm = createProductForm(allNotes, allSizes, allEssentialOils);
    
    productForm.handle(req, {
        'success': async (form) => {
            
            const product = new Products(form.data);

            // essentialoil.set('image', form.data.image);
            // essentialoil.set('price', form.data.price);
            // essentialoil.set('size', form.data.size);
            // essentialoil.set('stock', form.data.stock);
            // essentialoil.set('note_id', form.data.note_id);
            // essentialoil.set('size_id', form.data.size_id);
            
            await product.save();
            res.redirect('/essential-oils');
        },
        'error': async (form) => {
            res.render('products/create', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})


module.exports = router;