const express = require('express')
const router = express.Router()
const cartServices = require('../../services/carts')

router.get('/' , async (req , res) => {
    const accountId = req.account.id
    const cartItems = await cartServices.getCart(accountId)
    res.status(200)
    res.json({
        cartItems
    })
})


router.post('/:variant_id/add' , async (req , res) => {
    const accountId = req.account.id
    const variantId = Number(req.params.variant_id)
    const frameId = Number(req.body.frameId)
    const dimensionId = Number(req.body.dimensionId)
    const quantity = Number(req.body.quantity)
    let haveError = !accountId || !variantId || !quantity || !frameId || !dimensionId

    // console.log("account ==> " , accountId)
    // console.log("variant ==> " , variantId)
    // console.log("frame ==> " , frameId)
    // console.log("dimension ==> " , dimensionId)
    // console.log("quantity ==> " , quantity)
    // console.log("haveError ==> " , haveError)

    if(haveError){
        res.status(400)
        res.json({
            "error": "There are invalid fields detected"
        })
    }
    else{
        //accountId, variantId, frameId, dimensionId , quantity
        const addResult = await cartServices.addToCart(accountId, variantId, frameId, dimensionId, quantity)
        //console.log(addResult)
        if(addResult){
            //console.log("This if ran")
            res.status(200)
            res.json({
                "success": "Item has been added to cart"
            })
        }
        else{
            res.status(400)
            res.json({
                "error": "An error occurred when adding to cart, please try again"
            })
        }
    }
    
})

router.put('/:variant_id/update' , async (req , res) => {
    //accountId , variantId, newQuantity
    const accountId = req.account.id
    const variantId = Number(req.params.variant_id)
    const frameId = Number(req.body.frameId)
    const dimensionId = Number(req.body.dimensionId)
    const quantity = Number(req.body.quantity)
    let haveError = !accountId || !variantId || !quantity || !frameId || !dimensionId
    console.log("This is req params ==> " , req.params)
    console.log("This is req body ==> " , req.body)
    
    if(haveError){
        res.status(400)
        res.json({
            "error": "There are invalid fields detected"
        })
    }
    else{
        const updateResult = await cartServices.updateCartItem(accountId, variantId, quantity , frameId, dimensionId )
        console.log(updateResult)
        if(updateResult){
            res.status(200)
            res.json({
                "success": "Item has been updated in the cart"
            })
        }
        else{
            res.status(400)
            res.json({
                "error": "An error occurred while updating, please try again"
            })
        }
    }
})

router.delete('/delete/:cart_id/variant/:variant_id' , async (req , res) => {
    const accountId = req.account.id
    const variantId = req.params.variant_id
    const cartId = req.params.cart_id

    console.log("variantId ==> " , variantId)
    console.log("cartId ==> " , cartId)

    let haveError = !accountId || !variantId || !cartId
    if(haveError){
        res.status(400)
        res.json({
            "error": "There are invalid fields detected"
        })
    }
    const deleteResult = await cartServices.deleteCartItem(accountId, variantId, cartId)
    if(deleteResult){
        res.status(200)
        res.json({
            "success": "Item has been successfully removed from the shopping cart"
        })
    }
    else{
        res.status(500)
        res.json({
            "error": "Internal server error"
        })
    }
})


module.exports = router