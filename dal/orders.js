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

const getAllOrderStatus = async () => {
    return await OrderStatus.fetchAll().map(status => {
        return [status.get('id'), status.get('status')]
    });
}

const getOrderById = async (orderId) => {
    return await Order.where({
        'id': orderId
    }).fetch({
        withRelated: ['orderStatus' , 'account' , 'orderItems'], 
        require: true  
    })
}

// const getOrderStatusById = async (orderStatusId) => {

// }



module.exports = { addOrder, addOrderItem, getAllOrders, getAllOrderStatus, getOrderById }