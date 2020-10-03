
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


exports.signup = (req, res) => {
    const {name, email, password} = req.body;

    User.findOne({email}).exec((err, user) => {
        if(user){
            return res.status(400).json({
                error: 'Email is taken'
            })
        }
        
        const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '30min'});
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Account Activation Link`,
            html: `
                <p>Please use the following link to activate your account<p/>
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                <hr />
                <p>You don't need to reply this email.</p>
            `
        }

        sgMail.send(emailData).then(sent => {
            return res.json({
                message: `Email has been sent to ${email}. Follow the instructions to activate your account.`
            })
        })
        .catch(error => {
            console.log('SIGNUP EMAIL SENT ERROR', error);
            return res.json({
                message: err.message
            })
        })

    })
}

exports.accountActivation = (req, res) => {
    const {token} = req.body;
    if(token){
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if(err){
                console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
                return res.status(401).json({
                    error: 'Expired link. Signup again.'
                })
            }

            const {name, email, password} = jwt.decode(token);
            const user = new User({name, email, password});
            user.save((err, user) => {
                if(err){
                    console.log('SAVE USER  IN ACCOUNT ACTIVATION ERROR', err);
                    return res.status(400).json({
                        error: err
                    })
                }
                res.json({
                    message: 'Signup success! Please signin.'
                })
            })

        })
    } else{
        res.json({
            message: 'Something went wrong getting your token. Try again.'
        })
    }
}


exports.signin = (req, res) => {
        const {email, password} = req.body;
        //check if user exists
        User.findOne({email}).exec((err, user) => {
            if(err || !user){
                return res.status(400).json({
                    error: 'User with that email does not exist. Please signup'
                })
            }
            //authenticate
            if(!user.authenticate(password)){
                return res.status(400).json({
                    error: 'Email and password do not match'
                })
            }
            //generate a token and send to client
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
            const {_id, name, email, role} = user;
            
            return res.json({
                token,
                user : {_id, name, email, role}
            })

        })
}