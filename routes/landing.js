const express = require("express");
const router = express.Router();

router.get("/" , function(req , res){
    res.redirect('accounts/login')
})


module.exports = router