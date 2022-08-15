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

const getProductById = async(productId) => {
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



module.exports = { getAllProducts, getAllThemes, getProductById, getVariantsByProductId, getVariantById }