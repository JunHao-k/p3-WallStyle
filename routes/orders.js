const express = require("express")
const router = express.Router()
const orderDataLayer = require('../dal/orders')

router.get('/' , async (req , res) => {
    const orders = await orderDataLayer.getAllOrders()
    res.render('orders/index' , {
        'orders': orders.toJSON()
    })
})


module.exports = router