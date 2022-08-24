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

module.exports = { addOrder, addOrderItem }