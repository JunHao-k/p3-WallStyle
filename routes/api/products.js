const express = require("express")
const router = express.Router()
const { Product, Theme, Variant } = require('../../models')
const productDataLayer = require('../../dal/products')

router.get("/" , async (req , res) => {
    const allProducts = await productDataLayer.getAllProducts()
    res.status(200)
    res.json(allProducts)
})


router.get('/:product_id' , async (req , res) => {
    const product = await productDataLayer.getProductById(req.params.product_id)
    res.status(200)
    res.json(product)
})

router.get('/themes' , async (req , res) => {
    const themes = await productDataLayer.getThemes()
    res.status(200)
    res.json(themes)
})

router.get('/theme/:theme_id' , async (req , res) => {
    const product = await productDataLayer.getProductByTheme(req.params.theme_id)
    console.log(product.toJSON())
    res.status(200)
    res.json(product)
})




module.exports = router;