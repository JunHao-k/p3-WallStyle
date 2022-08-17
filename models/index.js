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

const Role = bookshelf.model('Role' , {
    tableName: 'roles',
    accounts: function(){
        return this.hasMany('Account')
    }
})

const Account = bookshelf.model('Account' , {
    tableName: 'accounts',
    role: function(){
        return this.belongsTo('Role')
    },
})

module.exports = { Product, Theme, Variant, Role, Account }