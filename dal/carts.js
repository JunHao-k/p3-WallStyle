const { CartItem } = require("../models")

const getCart = async (accountId) => {
    return await CartItem.collection().where({
        account_id: accountId
    }).fetch({
        require: false,
        withRelated: ['dimension' , 'frame' , 'variant' , 'variant.product' , 'account' , 'account.role'] // Name of the relationship
    })
}

module.exports = { getCart }