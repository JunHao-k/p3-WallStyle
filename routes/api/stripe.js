const express = require('express');
const router = express.Router();
// const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY , {
//     apiVersion: "2020-08-27"
// });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


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

            console.log(stripeSession.customer_details.address)

            const orderInfo = {
                account_id: accountId,
                total_cost: stripeSession.amount_total,
                billing_country: stripeSession.customer_details.address.country,
                billing_address_one: stripeSession.customer_details.address.line1,
                billing_address_two: stripeSession.customer_details.address.line2,
                billing_address_postal_code: stripeSession.customer_details.address.postal_code,
                receipt_url: receipt,
                payment_type: paymentType,
                shipping_country: stripeSession.customer_details.address.country,
                shipping_address_one: stripeSession.customer_details.address.line1,
                shipping_address_two: stripeSession.customer_details.address.line2,
                shipping_address_postal_code: stripeSession.customer_details.address.postal_code,


            }

            // metaData info
            // const metaData = JSON.parse(event.data.object.metadata.orders)
            // const accountId = metaData[0].account_id

            // const paymentIntent = await Stripe.paymentIntents.retrieve(stripeSession.payment_intent)
            // const chargeId = paymentIntent.charges.data[0].id
            // const charge = await Stripe.charges.retrieve(chargeId)
            // const receiptUrl = charge.receipt_url

            // const paymentType = charge.payment_method_details.type

            // const orderInfo = {
            //     account_id: accountId

            // }
            res.json({
                'success': "Payment made successfully",
                stripeSession
            })
        }

    }catch(error){
        console.log(error)
        res.status(500)
    }
})

module.exports = router