const { Product, Theme, Variant } = require('../models')

const getAllProducts = async () => {
    return await Product.collection().fetch({
        'withRelated': ['themes']
    })
}

module.exports = { getAllProducts }