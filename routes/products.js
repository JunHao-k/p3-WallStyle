const express = require("express")
const router = express.Router()
const {Product} = require('../models')

router.get("/" , async(req , res) => {
    let products = await Product.collection().fetch({
        'withRelated': ['images' , 'themes']
    })
    res.render('products/index' , {
        'products': products.toJSON()
    })
})

module.exports = router