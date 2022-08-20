const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { checkIfAuthenticatedJWT } = require("../../middlewares")

const generateAccessToken = function(account , tokenSecret , expiry){
    return jwt.sign({
        'first_name': account.get('first_name'),
        'last_name': account.get('last_name'),
        'id': account.get('id'),
        'role_id': account.get('role_id'),
        'email': account.get('email')
    } , tokenSecret , {
        expiresIn: expiry
    })
}

const refreshAccessToken = function(
    first_name,
    last_name,
    id,
    role_id,
    email,
    tokenSecret,
    expiry
){
    return jwt.sign({
        first_name, last_name, id, role_id, email,
    } , tokenSecret, {
        expiresIn: expiry
    })
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    // The output will be converted to hexdecimal
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { Account, BlacklistedToken } = require('../../models')

router.post('/login' , async function(req , res){
    const account = await Account.where({
        'email': req.body.email,
        'password': getHashedPassword(req.body.password)
    }).fetch({
        require: false
    })
    if(account){
        // Access token should be in react state
        const accessToken = generateAccessToken(account , process.env.TOKEN_SECRET, '1h')
        const refreshToken = generateAccessToken(account, process.env.REFRESH_TOKEN_SECRET, '7d')
        res.send({
            accessToken,
            refreshToken
        })
    }
    else{
        res.sendStatus(401)
        res.json({
            'error': 'Invalid login credentials'
        })
    }
})

router.get("/profile" , checkIfAuthenticatedJWT, function(req,res){
    const account = req.account
    res.json(account)
})

// Route to get new access token
router.post('/refresh' , async function(req,res){
    // Get refresh token from the body
    const refreshToken = req.body.refreshToken
    if(refreshToken){

        // Check if the token is already blacklisted
        const blacklistedToken = await BlacklistedToken.where({
            'token': refreshToken
        }).fetch({
            require: false
        })

        // If the blacklisted Token is not null, then it means it exists
        if(blacklistedToken){
            res.status(400)
            res.json({
                'error': 'Refresh token has been blacklisted'
            })
            return // return put here to end the function directly if blacklistedtoken exists in the blacklisted tokens table
        }


        // Verify if it is legit
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(err, tokenData){
            if(!err){
                console.log(tokenData)
                const accessToken = refreshAccessToken(
                    tokenData.first_name,
                    tokenData.last_name,
                    tokenData.id,
                    tokenData.role_id,
                    tokenData.email, 
                    process.env.TOKEN_SECRET, 
                    '1h'
                )
                res.json({
                    accessToken
                })
            }
            else{
                res.status(400)
                res.json({
                    'error': 'Invalid refresh token'
                })
            }
        })
    }
    else{
        res.status(400)
        res.json({
            'error': 'No refresh token found'
        })
    }
})

router.post('/logout' , async function(req,res){
    const refreshToken = req.body.refreshToken;
    if(refreshToken){

        
        // Verify if the refresh token is legit
        jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET, async function(err, tokenData){
            if(!err){
                // Add the refresh token to the blacklist
                const token = new BlacklistedToken()
                token.set('token' , refreshToken)
                token.set('date_created' , new Date())
                await token.save()
                res.json({
                    'message': 'Logged out'
                })
            }
        })
    }
    else{
        res.status(400);
        res.json({
            'error': 'No refresh token found!'
        })
    }
})


module.exports = router