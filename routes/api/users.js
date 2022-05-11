const express = require('express')
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const {checkIfAuthenticatedJWT} = require('../../middlewares');
const { User, BlacklistedToken } = require('../../models');

const generateAccessToken = (user, secret, expiresIn) => {
    const jwtAccessToken = jwt.sign({
        'id': user.get('id'),
        'name': user.get('name'),
        'email': user.get('email')
    }, secret, {
        'expiresIn': expiresIn
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

        let accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, "1h");
        let refreshToken = generateAccessToken(user, process.env.REFRESH_TOKEN_SECRET, "1d");
        let user_id = user.get("id");

        console.log(accessToken)
        console.log(refreshToken)

        res.status(200) // login success
        res.send({
            'accessToken': accessToken,
            'refreshToken': refreshToken,
            'user_id': user_id
        })
    } else {
        res.status(204)
        res.send("Wrong email or password")
    }
})

router.get('/profile', checkIfAuthenticatedJWT, async function(req,res) {
    let user = await User.where({
        'id': req.user.id
    }).fetch({
        require: true
    });

    res.send(user)
})

// send the refresh token
router.post('/refresh', async function(req,res){
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    };

    // check if given refresh token has been black listed
    let blacklistedToken = await BlacklistedToken.where({
        'token': refreshToken
    }).fetch({
        require: false
    })

    // if the refresh token has already been blacklisted
    if (blacklistedToken) {
        res.status(401);
        return res.send({
            'message':"The refresh token has already expired."
        })
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(err,payload){
        if (err) {
            return res.sendStatus(401);
        }
        // create the new access token
        let accessToken = generateAccessToken(payload, process.env.TOKEN_SECRET, '15m');
        res.send({
            accessToken
        })
    })
})

router.post('/logout', async(req,res)=>{
    let refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            async function(err,payload){
                if (err) {
                    return res.sendStatus(401);
                } 
                const token = new BlacklistedToken();
                token.set('token', refreshToken);
                token.set('date_created', new Date())
                await token.save();

                res.status(200)
                res.send("logged out successfully")
            })
    }
})

module.exports = router;


