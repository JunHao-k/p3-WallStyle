const express = require("express")
const router = express.Router()
const { Product, Theme, Variant } = require('../models')
const productDataLayer = require('../../dal/products')


router.get('/:product_id' , async (req , res) => {
    const product = await productDataLayer.getProductById(req.params.product_id)
    res.status(200)
    res.json(product)
})


module.exports = router;