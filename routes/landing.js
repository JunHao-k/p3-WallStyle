const express = require("express");
const router = express.Router();
const { Role, Account } = require("../models")
const { createAccountForm, createLoginForm, bootstrapField } = require("../forms")
const accountDataLayer = require('../dal/accounts')
const crypto = require('crypto')

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    // The output will be converted to hexdecimal
    const hash = sha256.update(password).digest('base64');
    return hash;
}


router.get("/" , function(req , res){
    const loginForm = createLoginForm()
    res.render('accounts/login' , {
        'form': loginForm.toHTML(bootstrapField)
    })
})

router.post('/' , async (req , res) => {

    const loginForm = createLoginForm()

    loginForm.handle(req , {
        'success': async function(form){
            const account = await Account.where({
                'email': form.data.email,
                'password': getHashedPassword(form.data.password)
            }).fetch({
                require: false
            })

            // Check if the user does not exist
            if(!account){
                req.flash("error_messages" , "Invalid credentials")
                res.redirect("/accounts/login");
            }
            else{
                req.session.account = {
                    id: account.get('id'),
                    email: account.get('email'),
                    first_name: account.get('first_name'),
                    last_name: account.get('last_name'),
                    role_id: account.get('role_id')
                }
                req.flash('success_messages' , 'Welcome back, ' + account.get('first_name') + ' ' + account.get('last_name'))
                res.redirect('/products')
                // if(account.get('role_id') == 1){
                //     req.session.account = {
                //         id: account.get('id'),
                //         email: account.get('email'),
                //         first_name: account.get('first_name'),
                //         last_name: account.get('last_name'),
                //         role_id: account.get('role_id')
                //     }
                //     req.flash('success_messages' , 'Welcome back, ' + account.get('first_name') + ' ' + account.get('last_name'))
                //     res.redirect('/products')
                // }
                // else{
                //     req.flash("error_messages" , "Your account is not authorised to view this page, please use the correct account")
                //     res.redirect("/accounts/login");
                // }
                
            }
        },
        'error': function(form){
            req.flash("error_messages" , "There are some problems logging you in. Please fill in the form again")
            res.render('accounts/login' , {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})

module.exports = router