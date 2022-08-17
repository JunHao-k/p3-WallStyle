const checkIfLoggedIn = function(req , res , next){
    const account = req.session.account
    if(!account){
        req.flash('error_messages' , "Only logged in users may view this page")
        res.redirect("/accounts/login")
    }
    else{
        next()
    }
}

const checkIfAuthorised = function(req , res , next){
    const account = req.session.account
    if(account.role_id != 1){
        req.flash('error_messages' , "Your account is not authorised to view this page, please use the correct account")
        res.redirect("/accounts/login")
    }
    else{
        next()
    }
}


module.exports = { checkIfLoggedIn, checkIfAuthorised }