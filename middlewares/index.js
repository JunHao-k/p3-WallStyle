const jwt = require('jsonwebtoken')


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

checkIfAuthenticatedJWT = function(req , res , next){
    // Extract out the authorization headers
    const authHeader = req.headers.authorization
    if(authHeader){
        // Extract out the JWT and check if it is valid
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.TOKEN_SECRET, function(err , tokenData){
            // tokenData is the data we embedded into the JWT as payload
            if(err){
                res.status(401);
                res.json({
                    'error': "Invalid access token"
                })
            }
            else{
                req.account = tokenData
                next()
            }
        })
        
    }
    else{
        res.status(401)
        res.json({
            'error': 'No authorization headers found'
        })
        // res.send(req.path)
        // res.send(req.url)
        return 
    }
}

module.exports = { checkIfLoggedIn, checkIfAuthorised, checkIfAuthenticatedJWT }