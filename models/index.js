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

const BlacklistedToken = bookshelf.model('BlacklistedToken' , {
    tableName:'blacklisted_tokens'
})





const Dimension = bookshelf.model('Dimension' , {
    tableName: 'dimensions',
    dimension: function(){
        return this.hasMany('CartItem')
    }
})

const Frame = bookshelf.model('Frame' , {
    tableName: 'frames',
    frame: function(){
        return this.hasMany('CartItem')
    }
})


const CartItem = bookshelf.model('CartItem' , {
    tableName: 'cart_items',
    dimension: function(){
        return this.belongsTo('Dimension')
    },
    frame: function(){
        return this.belongsTo('Frame')
    },
    variant: function(){
        return this.belongsTo('Variant')
    },
    account: function(){
        return this.belongsTo('Account')
    }

})


module.exports = { Product, Theme, Variant, Role, Account, BlacklistedToken, Dimension, Frame, CartItem }