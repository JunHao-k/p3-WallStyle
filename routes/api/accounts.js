const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

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

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    // The output will be converted to hexdecimal
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { Account } = require('../../models')

router.post('/login' , async function(req , res){
    const account = await Account.where({
        'email': req.body.email,
        'password': getHashedPassword(req.body.password)
    }).fetch({
        require: false
    })
    if(account){
        const accessToken = generateAccessToken(account , process.env.TOKEN_SECRET, '1h')
        res.send({
            accessToken
        })
    }
    else{
        res.sendStatus(401)
        res.json({
            'error': 'Invalid login credentials'
        })
    }
})


module.exports = router