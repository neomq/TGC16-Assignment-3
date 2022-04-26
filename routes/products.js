const express = require("express");
const router = express.Router();

// import in the Product model
const { Essentialoil, Note } = require('../models');

// import in the Forms
const { bootstrapField, createProductForm } = require('../forms');

router.get('/', async (req, res) => {
    // fetch all the essential oils (ie, SELECT * from essentialOils)
    let essential_oils = await Essentialoil.collection().fetch({
        withRelated:['note']
    });
    res.render('products/index', {
        'essential_oils': essential_oils.toJSON() // convert collection to JSON
    })
})

// render create form
router.get('/create', async (req, res) => {
    
    const allNotes = await Note.fetchAll().map((n) => {
        return [n.get('id'), n.get('name')];
    })

    const productForm = createProductForm(allNotes);
    
    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    })
})

// process submitted form
router.post('/create', async(req, res) => {

    const allNotes = await Note.fetchAll().map((n) => {
        return [n.get('id'), n.get('name')];
    })

    const productForm = createProductForm(allNotes);
    
    productForm.handle(req, {
        'success': async (form) => {
            const essentialoil = new Essentialoil(form.data);

            // essentialoil.set('image', form.data.image);
            // essentialoil.set('name', form.data.name);
            // essentialoil.set('price', form.data.price);
            // essentialoil.set('size', form.data.size);
            // essentialoil.set('item_description', form.data.item_description);
            // essentialoil.set('application', form.data.application);
            // essentialoil.set('directions', form.data.directions);
            // essentialoil.set('benefits_description', form.data.benefits_description);
            // essentialoil.set('stock', form.data.stock);
            // essentialoil.set('note_id', form.data.note_id);
            
            await essentialoil.save();
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