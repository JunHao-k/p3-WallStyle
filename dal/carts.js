const { CartItem, Frame, Dimension } = require("../models")

const getCart = async(accountId) => {
    return await CartItem.collection().where({
        'account_id': accountId
    }).fetch({
        require: false,
        withRelated: ['dimension' , 'frame' , 'variant' , 'variant.product' , 'account' , 'account.role'] // Name of the relationship
    })
}



const getFrameById = async(frameId) => {
    return await Frame.where({
        'id': frameId
    }).fetch({
        require: false
    })
}

const getDimensionById = async(dimensionId) => {
    return await Dimension.where({
        'id': dimensionId
    }).fetch({
        require: false
    })
}

const getCartItem = async(accountId , variantId) => {
    return await CartItem.where({
        'account_id': accountId,
        'variant_id': variantId
    }).fetch({
        require: false
    })
}

const getFrameCost = async(accountId , variantId) => {
    const cartItem = await getCartItem(accountId , variantId)
    let frameCost = cartItem.related('frame').get('frame_cost')
    let productStock = cartItem.related('variant.product').get('stock')
}

const createCartItem = async(accountId , variantId , frameId , dimensionId , quantity) => {
    const cartItem = new CartItem({
        'account_id': accountId,
        'variant_id': variantId,
        'frame_id': frameId,
        'dimension_id': dimensionId,
        'quantity': quantity
    })
    await cartItem.save()
    return cartItem
}

const updateItemQuantity = async(accountId , variantId, newQuantity) => {
    const cartItem = await getCartItem(accountId , variantId)
    if(cartItem){
        cartItem.set('quantity' , newQuantity)
        await cartItem.save()
        return true
    }
    else{
        return false
    }
}

const removeCartItem = async (accountId , variantId) => {
    const cartItem = await getCartItem(accountId , variantId)
    if(cartItem){
        await cartItem.destroy()
        return true
    }
    else{
        return false
    }
}



module.exports = { getCart, getCartItem, createCartItem, updateItemQuantity, removeCartItem, getFrameById, getDimensionById }