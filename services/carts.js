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


const getComponentsCost = async (accountId , variantId, frameId, dimensionId) => {
    const cartItem = await cartDataLayer.getCartItem(accountId , variantId, frameId, dimensionId)
    let componentCost = {}
    let frameCost = cartItem.related('frame').get('frame_cost')
    let dimensionCost = cartItem.related('dimension').get('dimension_cost')
    componentCost.frame_cost = frameCost
    componentCost.dimension_cost = dimensionCost
    return componentCost
}

const getDiscount = async (accountId , variantId, frameId, dimensionId) => {
    const cartItem = (await cartDataLayer.getCartItem(accountId , variantId, frameId, dimensionId)).toJSON()
    let discountValue = cartItem.variant.product.sales
    return discountValue
}

const getTotalCost = async (accountId , variantId, frameId, dimensionId) => {
    const discountValue = await getDiscount(accountId , variantId, frameId, dimensionId)
    const componentCost = await getComponentsCost(accountId , variantId, frameId, dimensionId)
    if(discountValue != 0){
        let originalPrice = componentCost.frame_cost + componentCost.dimension_cost
        let discount_amt = (discountValue/100)*originalPrice
        return Math.trunc(originalPrice - discount_amt)
    }
    else{
        return (componentCost.frame_cost + componentCost.dimension_cost)
    }
}



const addToCart = async (accountId, variantId, frameId, dimensionId , quantity) => {

    const cartItem = await cartDataLayer.getCartItem(accountId, variantId, frameId, dimensionId)
    const stock = await getStock(variantId)


    const cartItemsByVariant = await cartDataLayer.getCartItemsByVariant(accountId , variantId)

    if(!cartItem){ // If not same item
        if(cartItemsByVariant.length != 0){ // Have existing variant just not the same package
            let totalVariantNum = 0
            for(let item of cartItemsByVariant){
                totalVariantNum += item.get('quantity')
            }
            if(totalVariantNum + quantity > stock){
                return false
            }
            else{
                await cartDataLayer.createCartItem(accountId , variantId , frameId , dimensionId , quantity)
                return true
            }
        }
        else{
            if(quantity <= stock){
                await cartDataLayer.createCartItem(accountId , variantId , frameId , dimensionId , quantity)
                return true
            }
            else{
                return false
            }
        }
    }
    else{
        return await updateCartItem(accountId , variantId, quantity , frameId, dimensionId)
        // let currentCartQty = cartItem.get('quantity')
        // if(currentCartQty + quantity <= stock){
        //     await cartDataLayer.updateItemQuantity(accountId , variantId, currentCartQty + quantity)
        //     return true
        // }
        // else{
        //     return false
        // }
        
    }

    
}

const updateCartItem = async (accountId , variantId, newQuantity , frameId, dimensionId) => {
    const currentStock = await getStock(variantId) // 4
    const cartItem = await cartDataLayer.getCartItem(accountId, variantId, frameId, dimensionId)
    const cartItemsByVariant = await cartDataLayer.getCartItemsByVariant(accountId , variantId)
    // console.log(cartItemsByVariant.toJSON())
    let others = 0 
    //const currentItemQty = cartItem.get('quantity') // 2 ==> supposed to be replaced by 4
    const currentItemId = cartItem.get('id') // Id = 3

    // console.log("currentItemId ==> " , currentItemId)
    // console.log("cartItemsByVariant ==> " , cartItemsByVariant.toJSON())

    for(let item of cartItemsByVariant){
        if(item.get('id') != currentItemId){
            others += item.get('quantity')
        }
    }
    console.log("others ==> " , others) // 2
    console.log("New Quantity ==> " , newQuantity)
    console.log("New Quantity + Others ==> " , newQuantity + others)
    if(newQuantity + others <= currentStock){
        await cartDataLayer.updateItemQuantity(accountId , variantId, newQuantity , frameId, dimensionId)
        return true
    }
    else{
        return false
    }
}

const deleteCartItem = async (accountId , variantId, cartId) => {
    return await cartDataLayer.removeCartItem(accountId , variantId, cartId)
}

const emptyCart = async (accountId) => {
    const allCartItems = await getCart(accountId)
    for(let eachCartItem of allCartItems){
        const variantId = eachCartItem.get('variant_id')
        const cartId = eachCartItem.get('id')
        await deleteCartItem(accountId, variantId, cartId)
    }
}


module.exports = { addToCart, getCart, getStock, updateCartItem, deleteCartItem, getComponentsCost, getDiscount, getTotalCost, emptyCart }