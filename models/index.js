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
    },
    cartItems: function(){
        return this.hasMany('CartItem')
    },
    orderItems: function(){
        return this.hasMany('OrderItem')
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
    orders: function(){
        return this.hasMany('Order')
    },
    cartItems: function(){
        return this.hasMany('CartItem')
    }
})

const BlacklistedToken = bookshelf.model('BlacklistedToken' , {
    tableName:'blacklisted_tokens'
})



const Dimension = bookshelf.model('Dimension' , {
    tableName: 'dimensions',
    cartItems: function(){
        return this.hasMany('CartItem')
    },
    orderItems: function(){
        return this.hasMany('OrderItem')
    }
})

const Frame = bookshelf.model('Frame' , {
    tableName: 'frames',
    cartItems: function(){
        return this.hasMany('CartItem')
    },
    orderItems: function(){
        return this.hasMany('OrderItem')
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


const OrderStatus = bookshelf.model('OrderStatus' , {
    tableName: 'order_status',
    orders: function(){
        return this.hasMany('Order')
    }
})

const Order = bookshelf.model('Order' , {
    tableName: 'orders',
    orderStatus: function(){
        return this.belongsTo('OrderStatus')
    },
    account: function(){
        return this.belongsTo('Account')
    },
    orderItems: function(){
        return this.hasMany('OrderItem')
    }
})

const OrderItem = bookshelf.model('OrderItem' , {
    // frame , dimension, order, variant
    tableName: 'order_items',
    order: function(){
        return this.belongsTo('Order')
    },
    variant: function(){
        return this.belongsTo('Variant')
    },
    frame: function(){
        return this.belongsTo('Frame')
    },
    dimension: function(){
        return this.belongsTo('Dimension')
    }
})


module.exports = { 
    Product, 
    Theme, 
    Variant, 
    Role, 
    Account, 
    BlacklistedToken, 
    Dimension, 
    Frame, 
    CartItem,
    OrderStatus,
    Order,
    OrderItem 
}