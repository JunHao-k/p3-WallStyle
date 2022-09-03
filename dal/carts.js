const { CartItem } = require("../models")

const getCart = async(accountId) => {
    return await CartItem.collection().where({
        'account_id': accountId
    }).fetch({
        require: false,
        withRelated: ['dimension' , 'frame' , 'variant' , 'variant.product' , 'account' , 'account.role'] // Name of the relationship
    })
}

const getCartItem = async(accountId , variantId , frameId, dimensionId) => {
    return await CartItem.where({
        'account_id': accountId,
        'variant_id': variantId,
        'frame_id': frameId,
        'dimension_id': dimensionId
    }).fetch({
        require: false,
        withRelated: ['dimension' , 'frame' , 'variant' , 'variant.product' , 'account' , 'account.role']
    })
}

const getCartItemByCartId = async(accountId , variantId , cartId) => {
    return await CartItem.where({
        'account_id': accountId,
        'variant_id': variantId,
        'id': cartId
    }).fetch({
        require: false,
        withRelated: ['dimension' , 'frame' , 'variant' , 'variant.product' , 'account' , 'account.role']
    })
}

const getCartItemsByVariant = async(accountId , variantId) => {
    return await CartItem.collection().where({
        'account_id': accountId,
        'variant_id': variantId,
        // 'frame_id': frameId,
        // 'dimension_id': dimensionId
    }).fetch({
        require: false,
        withRelated: ['dimension' , 'frame' , 'variant' , 'variant.product' , 'account' , 'account.role']
    })
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

const updateItemQuantity = async(accountId , variantId, newQuantity , frameId, dimensionId) => {
    const cartItem = await getCartItem(accountId , variantId, frameId, dimensionId)
    if(cartItem){
        cartItem.set('quantity' , newQuantity)
        // cartItem.set('frame_id' , frameId)
        // cartItem.set('dimension_id' , dimensionId)
        await cartItem.save()
        return true
    }
    else{
        return false
    }
}

const removeCartItem = async (accountId , variantId, cartId) => {
    const cartItem = await getCartItemByCartId(accountId , variantId, cartId)
    if(cartItem){
        await cartItem.destroy()
        return true
    }
    else{
        return false
    }
}



module.exports = { getCart, getCartItem, createCartItem, updateItemQuantity, removeCartItem, getCartItemsByVariant, getCartItemByCartId }