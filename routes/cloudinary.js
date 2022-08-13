const express = require('express')
const router = express.Router()

const cloudinary = require('cloudinary')

// Configure cloudinary
cloudinary.config({
    'api_key': process.env.CLOUDINARY_API_KEY,
    'api_secret': process.env.CLOUDINARY_API_SECRET
})


// This route will be called by the Cloudinary widget
router.get('/sign' , async (req , res) => {

    // Retrieve the parameters we need to send to cloudinary
    const params_to_sign = JSON.parse(req.query.params_to_sign)

    // Retrieve our Cloudinary API secret from the environment(.env)
    const apiSecret =  process.env.CLOUDINARY_API_SECRET

    // Get the signature (aka the CSRF from cloudinary)
    const signature = cloudinary.utils.api_sign_request(params_to_sign , apiSecret)

    // Send back the signature to the cloudinary widget
    res.send(signature)
})

module.exports = router;