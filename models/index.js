const bookshelf = require("../bookshelf")

const Product = bookshelf.model('Product' , {
    tableName: 'products',
    themes: function(){
        return this.belongsToMany('Theme')
    }
})

// const Image = bookshelf.model('Image' , {
//     tableName: 'images',
//     product: function(){
//         return this.belongsTo('Product')
//     }
// })

const Theme = bookshelf.model('Theme' , {
    tableName: 'themes',
    products: function(){
        return this.belongsToMany('Product')
    }
})

module.exports = { Product, Theme }