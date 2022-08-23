const express = require('express');
const router = express.Router();
const cartServices = require('../../services/carts');
// const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY , {
//     apiVersion: "2020-08-27"
// });
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



router.get('/' , async (req , res) => {
    const accountId = 11
    const cartItems = (await cartServices.getCart(accountId)).toJSON()
    let lineItems = []
	let meta = []

    for(let item of cartItems){
        const variantId = item.variant_id
        const frameId = item.frame_id
        const dimensionId = item.dimension_id
        let itemCost = (await cartServices.getTotalCost(accountId , variantId, frameId, dimensionId))
        let itemName = `${item.variant.product.title}/${item.dimension.dimension_size}/Model ${item.variant.model_name}/${item.frame.frame_type}`

        // const eachLineItem = {
        //     'name': itemName,
        //     'amount': itemCost,
        //     'quantity': item.quantity,
        //     'images': [item.variant.model_thumbnail],
        //     'currency': 'SGD'
        // }
        
        const eachLineItem = {
            'price_data': {
                'currency': 'SGD',
                'product_data':{
                    'name': itemName,
                    'images': [item.variant.model_thumbnail],
                },
                'unit_amount': itemCost
            },
            'quantity': item.quantity,  
        }
        lineItems.push(eachLineItem)
        meta.push({
            account_id: item.account.id,
            variant_id: item.variant.id,
            frame_id: item.frame_id,
            dimension_id: item.dimension_id,
            quantity: item.quantity
        })
    }

    let metaData = JSON.stringify(meta)
    const payment = {
        payment_method_types: ['card' , 'grabpay' , 'paynow'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + `?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: process.env.STRIPE_CANCEL_URL,
        billing_address_collection: 'required',
		shipping_address_collection: {
			allowed_countries: ['SG']
		},
        metadata: {
            'orders': metaData
        },
        mode: 'payment'
    }
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render("testing/checkout" , {
        sessionId: stripeSession.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
    
})

router.get("/success" , function (req , res){
    res.send("Payment success")
})

// router.post('/process_payment' , express.raw({type:'application/json'}) , async(req , res) => {
//     let payload = req.body //Payment information from stripe
//     let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET
//     let sigHeader = req.headers['stripe-signature'] // When stripe sneds info, there will be a signature and the key will be 'stripe-signature'
//     let event = null

//     try{
//         // sigHeader and endpointSecret should mash
//         event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret)
//         let validType = (event.type == 'checkout.session.completed') || (event.type == 'checkout.session.async_payment_succeeded')
//         if(validType){
//             // Payment session info
//             let stripeSession = event.data.object
//             console.log(stripeSession)

//             // metaData info
//             const metaData = JSON.parse(event.data.object.metadata.orders)
//             const accountId = metaData[0].account_id

//             const paymentIntent = await Stripe.paymentIntents.retrieve(stripeSession.payment_intent)
//             const chargeId = paymentIntent.charges.data[0].id
//             const charge = await Stripe.charges.retrieve(chargeId)
//             const receiptUrl = charge.receipt_url

//             const paymentType = charge.payment_method_details.type

//             // const orderInfo = {
//             //     account_id: accountId

//             // }
//             res.send({
//                 'success': 'Payment made successfully'
//             })
//         }

//     }catch(error){
//         console.log(error)
//         res.status(500)
//     }
// })

module.exports = router
