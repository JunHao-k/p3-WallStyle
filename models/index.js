const bookshelf = require("../bookshelf")

const Product = bookshelf.model('Product' , {
    tableName: 'products',
    images: function(){
        return this.hasMany('Image')
    },
    themes: function(){
        return this.belongsToMany('Theme')
    }
})

const Image = bookshelf.model('Image' , {
    tableName: 'images',
    product: function(){
        return this.belongsTo('Product')
    }
})

const Theme = bookshelf.model('Theme' , {
    tableName: 'themes',
    products: function(){
        return this.belongsToMany('Product')
    }
})

module.exports = { Product, Image, Theme }