const { OrderStatus, Order, OrderItem } = require('../models');

const addOrder = async (orderInfo) => {
    const order = new Order()
    order.set(orderInfo)
    await order.save()
    return order
}

const addOrderItem = async (orderItemInfo) => {
    const orderItem = new OrderItem()
    orderItem.set(orderItemInfo)
    await orderItem.save()
    return addOrderItem
}

const getAllOrders = async () => {
    return await Order.collection().fetch({
        'withRelated': ['orderStatus' , 'account' , 'orderItems']
    })
}

// const getOrderStatusById = async (orderStatusId) => {

// }



module.exports = { addOrder, addOrderItem, getAllOrders }