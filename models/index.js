const bookshelf = require("../bookshelf")

const Product = bookshelf.model('Product' , {
    tableName: 'products',
    themes: function(){
        return this.belongsToMany('Theme')
    },
    variants: function(){
        return this.hasMany('Variant')
    }
})

const Theme = bookshelf.model('Theme' , {
    tableName: 'themes',
    products: function(){
        return this.belongsToMany('Product')
    }
})

const Variant = bookshelf.model('Variant' , {
    tableName: 'variants',
    product: function(){
        return this.belongsTo('Product')
    }
})

module.exports = { Product, Theme, Variant }