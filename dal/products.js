const { Product, Theme, Variant } = require('../models')

const getAllProducts = async() => {
    return await Product.collection().fetch({
        'withRelated': ['themes']
    })
}

const getAllThemes = async() => {
    return await Theme.fetchAll().map(theme => {
        return [theme.get('id'), theme.get('name')]
    });
}

const getProductById = async (productId) => {
    return await Product.where({
        'id': productId
    }).fetch({
        withRelated: ['themes'], // Fetch all the themes associated with the product
        require: true  // If not found will cause an exception (aka an error)
    })
}

const getVariantsByProductId = async(productId) => {
    const variants = await Variant.where({
        'product_id': productId
    }).fetchAll({
        withRelated: ['product'], 
        require: false 
    })
    return variants
}

const getVariantById = async(variantId) => {
    const variant = await Variant.where({
        'id': variantId
    }).fetch({
        withRelated: ['product'], 
        require: true  // If not found will cause an exception (aka an error)
    })
    return variant
}

const updateStock = async(variantId , newQuantity , deductedQuantity) => {
    const variant = await getVariantById(variantId)
    const product = variant.related('product')
    const productStock = product.get('stock')

    variant.set('model_stock' , newQuantity)
    await variant.save()

    product.set('stock' , productStock - deductedQuantity)
    await product.save()

    return true
}



module.exports = { getAllProducts, getAllThemes, getProductById, getVariantsByProductId, getVariantById, updateStock }