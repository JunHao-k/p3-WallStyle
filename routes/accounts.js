const express = require('express')
const router = express.Router()

const { Role, Account } = require("../models")
const { createAccountForm, bootstrapField } = require("../forms")
const accountDataLayer = require('../dal/accounts')

router.get('/signup' , async function(req , res){

    const roles = await accountDataLayer.getAllRoles()
    const accountForm = createAccountForm(roles)
    res.render('accounts/signup' , {
        'form': accountForm.toHTML(bootstrapField)
    })
})

module.exports = router