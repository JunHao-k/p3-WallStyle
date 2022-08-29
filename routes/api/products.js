const express = require("express")
const router = express.Router()
const { Product, Theme, Variant } = require('../../models')
const productDataLayer = require('../../dal/products')

router.get("/" , async (req , res) => {
    const allProducts = await productDataLayer.getAllProducts()
    res.status(200)
    res.json(allProducts)
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
    res.json(products)
})


// router.get('/:product_id' , async (req , res) => {
//     const product = await productDataLayer.getProductById(req.params.product_id)
//     res.status(200)
//     res.json(product)
// })








module.exports = router;