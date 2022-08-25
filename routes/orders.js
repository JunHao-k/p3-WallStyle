const express = require("express")
const router = express.Router()
const orderDataLayer = require('../dal/orders')
const { createOrdersUpdateForm, bootstrapField  } = require('../forms');

router.get('/' , async (req , res) => {
    const orders = await orderDataLayer.getAllOrders()
    const allOrderStatus = await orderDataLayer.getAllOrderStatus()
    //const updateOrderStatusForm = createOrdersUpdateForm(allOrderStatus)

    res.render('orders/index' , {
        'orders': orders.toJSON()
    })
})

router.get("/:order_id/update" , async (req , res) => {
    const order = await orderDataLayer.getOrderById(req.params.order_id)
    const allOrderStatus = await orderDataLayer.getAllOrderStatus()

    const orderUpdateForm = createOrdersUpdateForm(allOrderStatus)

    orderUpdateForm.fields.email.value = order.related('account').get('email')
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
    const product = await dataLayer.getProductById(req.params.product_id)

    const variantForm = createVariantForm();

    variantForm.handle(req , {

        'success': async(form) => {
            
            let {...variantData} = form.data
            variant.set(variantData)

            await variant.save()
            req.flash("success_messages" , `Model ${variant.get('model_name')} for ${product.get('title')} has been updated`)
            res.redirect(`/products/${req.params.product_id}/variants`)
        },
        'error': async(form) => {
            res.render("products/update" , {
                'product': product.toJSON(),
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        'empty': async(form) => {
            res.render("products/update" , {
                'product': product.toJSON(),
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
    })
    // const order = await orderDataLayer.getOrderById(req.params.order_id)
    // const allOrderStatus = await orderDataLayer.getAllOrderStatus()

    // const orderUpdateForm = createOrdersUpdateForm(allOrderStatus)

    // orderUpdateForm.fields.email.value = order.related('account').get('email')
    // orderUpdateForm.fields.shipping_address_1.value = order.get('shipping_address_1')
    // orderUpdateForm.fields.shipping_address_2.value = order.get('shipping_address_2')
    // orderUpdateForm.fields.shipping_postal_code.value = order.get('shipping_postal_code')
    // orderUpdateForm.fields.order_status_id.value = order.get('order_status_id')

    // res.render("orders/update" , {
    //     "form": orderUpdateForm.toHTML(bootstrapField),
    //     "order": order.toJSON(),
    // })
})


module.exports = router