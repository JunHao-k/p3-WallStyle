const express = require('express');
const router = express.Router();
// const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY , {
//     apiVersion: "2020-08-27"
// });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const orderDataLayer = require('../../dal/orders');
const cartServices = require("../../services/carts")
const productDataLayer = require("../../dal/products")


// Webhook for stripe, after we create this endpoint, we will register it on Stripe as a webhook
// Stripe will always call this endpoint when payment is completed, it is a POST route because we will make changes to the database(orders)
router.post('/' , express.raw({type:'application/json'}) , async(req , res) => {
    let payload = req.body //Payment information from stripe
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET
    let sigHeader = req.headers['stripe-signature'] // When stripe sneds info, there will be a signature and the key will be 'stripe-signature'
    let event = null

    try{
        // sigHeader and endpointSecret should mash
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret)
        let validType = (event.type == 'checkout.session.completed') || (event.type == 'checkout.session.async_payment_succeeded')
        if(validType){
            // Payment session info
            let stripeSession = event.data.object
            //console.log(stripeSession)

            const paymentIntent = await Stripe.paymentIntents.retrieve(
                stripeSession.payment_intent
            );
            
            const metaData = JSON.parse(event.data.object.metadata.orders)
            const accountId = metaData[0].account_id
            const receipt = paymentIntent.charges.data[0].receipt_url
            const paymentType = paymentIntent.charges.data[0].payment_method_details.type
            const dateTime = new Date(paymentIntent.charges.data[0].created * 1000)

            //console.log(dateTime.toLocaleString())

            const orderInfo = {
                account_id: accountId,
                total_cost: stripeSession.amount_total,
                billing_country: stripeSession.customer_details.address.country,
                billing_address_1: stripeSession.customer_details.address.line1,
                billing_address_2: stripeSession.customer_details.address.line2,
                billing_postal_code: stripeSession.customer_details.address.postal_code,
                receipt_url: receipt,
                payment_type: paymentType,
                shipping_country: stripeSession.customer_details.address.country,
                shipping_address_1: stripeSession.customer_details.address.line1,
                shipping_address_2: stripeSession.customer_details.address.line2,
                shipping_postal_code: stripeSession.customer_details.address.postal_code,
                payment_reference: stripeSession.payment_intent,
                order_date: dateTime
            }

            const newOrder = await orderDataLayer.addOrder(orderInfo)
            // console.log(newOrder)
            const orderId = newOrder.get('id')

            for(let lineItem of metaData){
                const variantId = lineItem.variant_id
                const frameId = lineItem.frame_id
                const dimensionId = lineItem.dimension_id
                const quantity = lineItem.quantity
        
                const orderItemInfo = {
                    order_id: orderId,
                    quantity: quantity,
                    dimension_id: dimensionId,
                    frame_id: frameId,
                    variant_id: variantId
                }

                await orderDataLayer.addOrderItem(orderItemInfo)

                const currentVariantStock = await cartServices.getStock(variantId)
                await productDataLayer.updateStock(variantId, currentVariantStock - quantity , quantity)


            }
            await cartServices.emptyCart(accountId)
            res.status(201)
            res.json({
                'success': "Order successfully made"
            })
        }

    }catch(error){
        console.log(error)
        res.status(500)
    }
})

module.exports = router