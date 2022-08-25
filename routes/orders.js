const express = require("express")
const router = express.Router()
const { OrderStatus, Order, OrderItem } = require('../models')
const orderDataLayer = require('../dal/orders')
const { createOrdersUpdateForm, createOrderSearchForm, bootstrapField  } = require('../forms');

router.get('/' , async (req , res) => {
    
    const allOrderStatus = await orderDataLayer.getAllOrderStatus()
    allOrderStatus.unshift([0 , '--- Order Status ---'])

    // Create an instance of the search form
    const searchOrderForm = createOrderSearchForm(allOrderStatus)

    // Create a query builder
    let query = Order.collection()

    searchOrderForm.handle(req , {
        'success': async function(form){
            if(form.data.min_spending){
                query.where('total_cost' , '>=' , form.data.min_spending);
            }
            if(form.data.max_spending){
                query.where('total_cost' , '<=' , form.data.max_spending);
            }

            
            if(form.data.payment_type && form.data.payment_type != "0") {
                query.where('payment_type', 'like', '%' + form.data.payment_type + '%');
            }
            
            if(form.data.order_status && form.data.order_status != "0"){
                query.where('order_status_id', '=', form.data.order_status);
            }

            // if(form.data.order_status == 1) {
            //     query.where('order_status_id', '=', '1');
            // }
            // else if(form.data.order_status == 2){
            //     query.where('order_status_id', '=', '2');
            // }
            // else if(form.data.order_status == 3){
            //     query.where('order_status_id', '=', '3');
            // }
            // else if(form.data.order_status == 4){
            //     query.where('order_status_id', '=', '4');
            // }
            // else if(form.data.order_status == 5){
            //     query.where('order_status_id', '=', '5');
            // }
            // else{
            //     query.where('order_status_id', '=', '6');
            // }

            const orders = await query.fetch({
                withRelated: ['orderStatus' , 'account' , 'orderItems']
            })
            console.log(orders.toJSON())

            res.render('orders/index' , {
                'orders': orders.toJSON(),
                form: form.toHTML(bootstrapField)
            })

        },
        'empty': async function(form){
            const orders = await orderDataLayer.getAllOrders()
            res.render('orders/index' , {
                orders: orders.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        }
    })
    
})

router.get("/:order_id/update" , async (req , res) => {
    const order = await orderDataLayer.getOrderById(req.params.order_id)
    const allOrderStatus = await orderDataLayer.getAllOrderStatus()

    const orderUpdateForm = createOrdersUpdateForm(allOrderStatus)

    orderUpdateForm.fields.shipping_address_1.value = order.get('shipping_address_1')
    orderUpdateForm.fields.shipping_address_2.value = order.get('shipping_address_2')
    orderUpdateForm.fields.shipping_postal_code.value = order.get('shipping_postal_code')
    orderUpdateForm.fields.order_status_id.value = order.get('order_status_id')

    res.render("orders/update" , {
        "form": orderUpdateForm.toHTML(bootstrapField),
        "order": order.toJSON(),
    })
})

router.post("/:order_id/update" , async (req , res) => {

    const order = await orderDataLayer.getOrderById(req.params.order_id)
    const allOrderStatus = await orderDataLayer.getAllOrderStatus()

    const orderUpdateForm = createOrdersUpdateForm(allOrderStatus)

    orderUpdateForm.handle(req , {

        'success': async(form) => {
            
            let {...orderData} = form.data
            order.set(orderData)

            await order.save()
            req.flash("success_messages" , `Order ${order.get('id')} with payment reference of ${order.get('payment_reference')} has been updated`)
            res.redirect(`/orders`)
        },
        'error': async(form) => {
            res.render("orders/update" , {
                "form": orderUpdateForm.toHTML(bootstrapField),
                "order": order.toJSON(),
            })
        },
        'empty': async(form) => {
            res.render("products/update" , {
                "form": orderUpdateForm.toHTML(bootstrapField),
                "order": order.toJSON(),
            })
        },
    })
})


module.exports = router