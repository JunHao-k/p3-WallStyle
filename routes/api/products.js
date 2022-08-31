const express = require("express")
const router = express.Router()
const { Product, Theme, Variant } = require('../../models')
const productDataLayer = require('../../dal/products')

router.get("/" , async (req , res) => {
    const allProducts = await productDataLayer.getAllProducts()
    res.status(200)
    res.json(allProducts)
})

router.get("/search" , async (req , res) => {
    let query = Product.collection()
    let forLike = "like"
    let haveSearch = false
    if(process.env.DB_DRIVER == "postgres"){
        forLike = "ilike"
    }

    for(const [key, value] of Object.entries(req.query)){
        if(value.length > 0){
            haveSearch = true
            break;
        }
    }

    if(haveSearch){
        if(req.query.title){
            query.where('title' , forLike , '%' + form.data.title + '%');
        }
    
        if(req.query.on_sale == 1) {
            query.where('sales', '=', 0);
        }
        else if(req.query.on_sale == 2){
            query.where('sales', '!=', 0);
        }

        if(req.query.themes){
            query.query('join', 'products_themes', 'products.id', 'product_id').where('theme_id', 'in', form.data.themes.split(','));
        }

        if(req.query.combo == 1) {
            query.where('combo', '=', 1);
        }
        else if(req.query.combo == 2){
            query.where('combo', '=', 2);
        }
        else if(req.query.combo == 3){
            query.where('combo', '=', 3);
        }
        const allProducts = await query.fetch({
            withRelated: ['themes']
        })
        res.status(200)
        res.json(allProducts)
    }
    else{
        const allProducts = await productDataLayer.getAllProducts()
        res.status(200)
        res.json(allProducts)
    }
    

    // console.log(req.query)
    // res.send(req.query)
})

router.get('/themes' , async (req , res) => {
    const themes = await productDataLayer.getAllThemes()
    res.status(200)
    res.json(themes)
})

router.get('/theme/:theme_id' , async (req , res) => {
    const product = await productDataLayer.getProductByTheme(req.params.theme_id)
    //console.log(product.toJSON())
    res.status(200)
    res.json(product)
})

router.get('/variants/:product_id' , async (req , res) => {
    const variants = await productDataLayer.getVariantsByProductId(req.params.product_id)
    res.status(200)
    res.json(variants)
})

router.get('/get-product/:product_id' , async (req , res) => {
    const product = await productDataLayer.getProductById(req.params.product_id)
    res.status(200)
    res.json(product)
})


// router.get('/:product_id' , async (req , res) => {
//     const product = await productDataLayer.getProductById(req.params.product_id)
//     res.status(200)
//     res.json(product)
// })








module.exports = router;