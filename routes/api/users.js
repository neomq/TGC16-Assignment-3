const express = require('express')
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {checkIfAuthenticatedJWT} = require('../../middlewares');
const { User } = require('../../models');

const generateAccessToken = (user) => {
    const jwtAccessToken = jwt.sign({
        'id': user.get('id'),
        'name': user.get('name'),
        'email': user.get('email')
    }, process.env.TOKEN_SECRET, {
        expiresIn: "1h"
    });
    console.log(jwtAccessToken)
    return jwtAccessToken
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.post('/login', async (req, res) => {
    let user = await User.where({
        'email': req.body.email
    }).fetch({
        require: false
    });

    if (user && user.get('password') == getHashedPassword(req.body.password)) {
        let accessToken = generateAccessToken(user);
        res.send({
            accessToken
        })
    } else {
        res.send({
            'error':'Wrong email or password'
        })
    }
})


router.get('/profile', checkIfAuthenticatedJWT, function(req,res) {
    res.send({
        'message':"Welcome" + req.user.name
    })
})

module.exports = router;


