const cartDataLayer = require('../dal/carts')
const productDataLayer = require('../dal/products')

const getCart = async (accountId) => {
    const cartItems = await cartDataLayer.getCart(accountId);
    return cartItems
}

const getStock = async (variantId) => {
    const itemVariant = await productDataLayer.getVariantById(variantId) 
    const stock = Number(itemVariant.get('model_stock'))
    return stock
}


const addToCart = async(accountId, variantId, frameId, dimensionId , quantity) => {
    const cartItem = await cartDataLayer.getCartItem(accountId, variantId)
    const stock = await getStock(variantId)

    if(!cartItem){
        if(quantity <= stock){
            await cartDataLayer.createCartItem(accountId , variantId , frameId , dimensionId , quantity)
        }
        else{
            return false
        }
        
    }
    else{
        let currentCartQty = cartItem.get('quantity')
        if(currentCartQty + quantity <= stock){
            await cartDataLayer.updateItemQuantity(accountId , variantId, currentCartQty + quantity)
        }
        else{
            return false
        }
        
    }

    return true
}

const updateCartItem = async(accountId , variantId, newQuantity) => {
    const currentStock = await getStock(variantId)
    const cartItem = await cartDataLayer.getCartItem(accountId, variantId)
    let currentCartQty = cartItem.get('quantity')

    if(newQuantity + currentCartQty <= currentStock){
        return await cartDataLayer.updateItemQuantity(accountId , variantId, newQuantity + currentCartQty)
    }
    else{
        return false
    }
}

const deleteCartItem = async(accountId , variantId) => {
    return await cartDataLayer.removeCartItem(accountId , variantId)
}


module.exports = { addToCart, getCart, getStock, updateCartItem, deleteCartItem }