const express = require('express');
const router = express.Router();
const orderDataLayer = require('../../dal/orders')

router.get("/" , async (req , res) => {
    const accountId = req.account.id
    const allOrders = await orderDataLayer.getAllOrdersByAccount(accountId)
    res.status(200)
    res.json(allOrders)
})


module.exports = router;