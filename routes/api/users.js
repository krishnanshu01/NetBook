const express = require('express');

const gravatar = require('gravatar');

const jwt = require('jsonwebtoken');

const User = require('../../models/User')

const config = require('config')

const encrypt = require('bcryptjs');

const {check , validationResult} = require('express-validator');

const router = express.Router();

//@ tell about whose router is this
//@ details
//@ make it public or private
router.post('/' , [
    check('name' , 'Enter valid name').not().isEmpty(),
    check('email' , 'enter valid email').isEmail(),
    check('password',
    'Enter valid password of 6 charaters').isLength({min : 6})
] ,async (req , res) =>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    const {name , email , password} = req.body;

    try{
        //see user if exist
        let user = await User.findOne({email});

        if(user){
            return res.status(400).json({errors : [{msg : 'User Already Exist'}] });
        }
    
        //get user gravator(its like a user having profile pic)
        const avator = gravatar.url(email, {
            s : '200',
            r : 'pg',
            d : 'mm'
        });
    
        //encryp password
        user = new User({
            name,
            email,
            avator,
            password
        });
        const salt = await encrypt.genSalt(10);
        user.password = await encrypt.hash(password , salt);

        await user.save();

    
        //get jsontoken
        const payload = {
            user : {
                id : user.id
            }
        }
        jwt.sign(payload ,
             config.get('secrettoken'),
             {expiresIn:360000} , 
             (err , token) => {
                 if(err)
                    throw err;
                 res.json({token})
             });

    }catch(err){
        console.error(err.message);
        res.status(500).send('SERVER ERROR');
    }
})
module.exports = router;