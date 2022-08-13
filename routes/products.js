const express = require("express")
const router = express.Router()
const { Product, Theme } = require('../models')
const { bootstrapField, createProductForm } = require('../forms');

router.get("/" , async(req , res) => {
    let products = await Product.collection().fetch({
        'withRelated': ['themes']
    })
    // console.log(products.toJSON())
    res.render('products/index' , {
        'products': products.toJSON()
    })
})


router.get("/create" , async(req , res) => {
    const themes = await Theme.fetchAll().map(theme => {
        return [theme.get('id'), theme.get('name')]
    });
    
    const productForm = createProductForm(themes);
    res.render("products/create" , {
        form: productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })

})

router.post("/create" , async(req , res) => {
    const themes = await Theme.fetchAll().map(theme => {
        return [theme.get('id'), theme.get('name')]
    })

    const productForm = createProductForm(themes);

    productForm.handle(req , {
        'success': async function(form){
            const product = new Product
            product.set('title' , form.data.title)
            product.set('combo' , form.data.combo)
            product.set('sales' , form.data.sales)
            product.set('date' , form.data.date)
            product.set('stock' , form.data.stock)
            product.set('image_set' , form.data.image_set)

            await product.save()

            if(form.data.themes){
                await product.themes().attach(form.data.themes.split(','))
            }

            res.redirect("/products")
        },
        'error': function(form){
            res.render('products/create' , {
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        'empty': function(form){
            res.render('products/create' , {
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })

})

router.get("/:product_id/update" , async(req , res) => {

    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        withRelated: ['themes'], // Fetch all the themes associated with the product
        require: true  // If not found will cause an exception (aka an error)
    })

    const themes = await Theme.fetchAll().map(theme => {
        return [theme.get('id'), theme.get('name')]
    })

    const productForm = createProductForm(themes);
    
    productForm.fields.title.value = product.get("title")
    productForm.fields.combo.value = product.get("combo")
    productForm.fields.sales.value = product.get("sales")
    productForm.fields.date.value = product.get('date')
    productForm.fields.stock.value = product.get('stock')
    productForm.fields.image_set.value = product.get('image_set')

    let selectedThemes = await product.related('themes').pluck('id')
    productForm.fields.themes.value = selectedThemes

    res.render("products/update" , {
        "form": productForm.toHTML(bootstrapField),
        "product": product.toJSON(),
        // Pass cloudinary info to hbs file for use in JS block
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post("/:product_id/update" , async(req , res) => {

    const themes = await Theme.fetchAll().map(theme => {
        return [theme.get('id'), theme.get('name')]
    })

    const productForm = createProductForm(themes);

    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        withRelated: ['themes'], // Fetch all the themes associated with the product
        require: true  // If not found will cause an exception (aka an error)
    })

    productForm.handle(req , {
        'success': async(form) => {
            console.log("HERE ------------------------------------------------------> ")
            console.log(form.data)
            let {themes , ...productData} = form.data
            product.set(productData)

            let themeIds = themes.split(",").map(id => parseInt(id));

            let existingThemeIds = await product.related('themes').pluck('id')

            let toRemove = existingThemeIds.filter(id => themeIds.includes(id) === false)
            await product.themes().detach(toRemove);
            await product.themes().attach(themeIds);

            await product.save()
            res.redirect("/products")
        },
        'error': async(form) => {
            res.render("products/update" , {
                'product': product.toJSON(),
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        'empty': async(form) => {
            res.render("products/update" , {
                'product': product.toJSON(),
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
    })
})

module.exports = router