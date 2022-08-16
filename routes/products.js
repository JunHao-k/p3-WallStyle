const express = require("express")
const router = express.Router()
const { Product, Theme, Variant } = require('../models')
const { bootstrapField, createVariantForm, createProductForm, createSearchForm } = require('../forms');
const dataLayer = require('../dal/products')


/* -------------------------------------- READ for main products ---------------------------------- */


router.get("/" , async(req , res) => {

    // Get all the possible themes
    const themes = await dataLayer.getAllThemes()
    themes.unshift([0 , '--- Any Theme ---'])

    // Create an instance of the search form
    const searchForm = createSearchForm(themes)

    // Create a query builder
    let query = Product.collection()

    // Search logic begins here:
    searchForm.handle(req , {
        'success': async function(form){


            if(form.data.title){
                query.where('title' , 'like' , '%' + form.data.title + '%');
            }

            if(form.data.on_sale == 1) {
                query.where('sales', '=', 0);
            }
            else if(form.data.on_sale == 2){
                query.where('sales', '!=', 0);
            }
            
            
  
            if(form.data.min_discount){
                query.where('sales' , '>=' , form.data.min_discount);
            }
            if(form.data.max_discount){
                query.where('sales' , '<=' , form.data.max_discount);
            }


            if(form.data.stock){
                query.where('stock' , '=' , form.data.stock);
            }


            if(form.data.date){
                query.where('date' , '=' , form.data.date);
            }

            if(form.data.combo == 1) {
                query.where('combo', '=', 1);
            }
            else if(form.data.combo == 2){
                query.where('combo', '=', 2);
            }
            else if(form.data.combo == 3){
                query.where('combo', '=', 3);
            }


            if(form.data.themes){
                query.query('join', 'products_themes', 'products.id', 'product_id').where('theme_id', 'in', form.data.themes.split(','));
            }

            const products = await query.fetch({
                withRelated: ['themes']
            })

            res.render('products/index' , {
                products: products.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        'empty': async function(form){
            const products = await dataLayer.getAllProducts()
            res.render('products/index' , {
                products: products.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        }
    })

    // let products = await dataLayer.getAllProducts()
    // res.render('products/index' , {
    //     'products': products.toJSON()
    // })
})

/* -------------------------------------- END OF READ for main products ---------------------------------- */





/* ---------------------------------------- CREATE for main products -------------------------------------- */

router.get("/create" , async(req , res) => {

    const themes = await dataLayer.getAllThemes()

    const productForm = createProductForm(themes);

    res.render("products/create" , {
        form: productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })

})

router.post("/create" , async(req , res) => {

    const themes = await dataLayer.getAllThemes()

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
            req.flash("success_messages" , `New product ${product.get('title')} has been added`)
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

/* ---------------------------------------- END OF CREATE for main products -------------------------------------- */




/* ---------------------------------------- UPDATE for main products -------------------------------------- */

router.get("/:product_id/update" , async(req , res) => {

    const product = await dataLayer.getProductById(req.params.product_id)
    const themes = await dataLayer.getAllThemes()

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

    const themes = await dataLayer.getAllThemes()

    const productForm = createProductForm(themes);

    const product = await dataLayer.getProductById(req.params.product_id)

    productForm.handle(req , {
        'success': async(form) => {
            // console.log("HERE ------------------------------------------------------> ")
            // console.log(form.data)
            let {themes , ...productData} = form.data
            product.set(productData)

            let themeIds = themes.split(",").map(id => parseInt(id));

            let existingThemeIds = await product.related('themes').pluck('id')

            let toRemove = existingThemeIds.filter(id => themeIds.includes(id) === false)
            await product.themes().detach(toRemove);
            await product.themes().attach(themeIds);

            await product.save()
            req.flash("success_messages" , `Product ${product.get('title')} has been updated`)
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


/* ---------------------------------------- END OF UPDATE for main products -------------------------------------- */


/* ---------------------------------------- DELETE for main products -------------------------------------- */

router.post("/:product_id/delete" , async(req , res) => {
    const product = await dataLayer.getProductById(req.params.product_id)
    let deleteResult = false
    if(product){
        deleteResult = true
    }
    product.destroy()
    if(deleteResult){
        req.flash('success_messages' , "Product has been successfully deleted")
    }
    else{
        req.flash("error_messages" , "Delete unsuccessful. Please try again")
    }
    
    res.redirect(`/products`)
})

/* ---------------------------------------- END OF DELETE for main products -------------------------------------- */





/* ------------------------------------------- GET FOR VARIANTS --------------------------------------------------- */


router.get("/:product_id/variants" , async (req , res) => {

    const variants = await dataLayer.getVariantsByProductId(req.params.product_id)

    const product = await dataLayer.getProductById(req.params.product_id)

    res.render("variants/index" , {
        'product': product.toJSON(),
        'variants': variants.toJSON()
    })
})


/* ---------------------------------------- END OF GET FOR VARIANTS -------------------------------------- */





/* ------------------------------------------- CREATE FOR VARIANTS --------------------------------------------------- */



router.get("/:product_id/variants/create" , async (req , res) => {
    
    const variantForm = createVariantForm();

    res.render("variants/create" , {
        form: variantForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post("/:product_id/variants/create" , async (req , res) => {
    let productId = req.params.product_id
    const product = await dataLayer.getProductById(productId)
    const variantForm = createVariantForm();
    variantForm.handle(req , {
        'success': async function(form){
            // console.log(form.data)
            const variant = new Variant
            variant.set('product_id' , req.params.product_id)
            variant.set('model_name' , form.data.model_name)
            variant.set('model_stock' , form.data.model_stock)
            variant.set('last_updated' , form.data.last_updated)
            variant.set('model_image' , form.data.model_image)
            variant.set('model_thumbnail' , form.data.model_thumbnail)

            await variant.save()
            req.flash("success_messages" , `New model for ${product.get('title')} has been added`)
            res.redirect(`/products/${productId}/variants`)
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



/* ------------------------------------------- END OF CREATE FOR VARIANTS --------------------------------------------------- */




/* ------------------------------------------- UPDATE FOR VARIANTS --------------------------------------------------- */

router.get("/:product_id/variants/:variant_id/update" , async (req , res) => {

    const variant = await dataLayer.getVariantById(req.params.variant_id)

    const product = await dataLayer.getProductById(req.params.product_id)
    
    const variantForm = createVariantForm();
    
    variantForm.fields.model_name.value = variant.get("model_name")
    variantForm.fields.model_image.value = variant.get("model_image")
    variantForm.fields.model_stock.value = variant.get("model_stock")
    variantForm.fields.last_updated.value = variant.get('last_updated')
    variantForm.fields.model_thumbnail.value = variant.get('model_thumbnail')

    res.render("variants/update" , {
        "form": variantForm.toHTML(bootstrapField),
        "product": product.toJSON(),
        "variant": variant.toJSON(),
        // Pass cloudinary info to hbs file for use in JS block
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})


router.post("/:product_id/variants/:variant_id/update" , async (req , res) => {

    const variant = await dataLayer.getVariantById(req.params.variant_id)
    const product = await dataLayer.getProductById(req.params.product_id)

    const variantForm = createVariantForm();

    variantForm.handle(req , {
        'success': async(form) => {
            
            let {...variantData} = form.data
            variant.set(variantData)

            await variant.save()
            req.flash("success_messages" , `Model ${variant.get('model_name')} for ${product.get('title')} has been updated`)
            res.redirect(`/products/${req.params.product_id}/variants`)
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

/* ------------------------------------------- END OF UPDATE FOR VARIANTS --------------------------------------------------- */






/* ------------------------------------------- DELETE FOR VARIANTS --------------------------------------------------- */


router.post("/:product_id/variants/:variant_id/delete" , async (req , res) => {
    const variant = await dataLayer.getVariantById(req.params.variant_id)
    let productid = req.params.product_id
    let deleteResult = false
    if(variant){
        deleteResult = true
    }
    variant.destroy()
    if(deleteResult){
        req.flash('success_messages' , "Model variant has been successfully deleted")
    }
    else{
        req.flash("error_messages" , "Delete unsuccessful. Please try again")
    }
    
    res.redirect(`/products/${productid}/variants`)
})


/* ------------------------------------------- END OF DELETE FOR VARIANTS --------------------------------------------------- */


module.exports = router