const express = require('express');

const router = express.Router();

const auth = require('../../middeware/auth');
const User = require('../../models/User')
const encrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const {check , validationResult} = require('express-validator');

const config = require('config');


//@ tell about whose router is this
//@ details
//@ make it public or private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('SERVER ERROR');

    }
});
router.post('/', [
    check('email', 'enter valid email').isEmail(),
    check('password',
        'Enter password').exists()
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const {email, password } = req.body;

    try {
        //see user if exist
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Username' }] });
        }
    
        const ismatch = await encrypt.compare(password , user.password);
        if(!ismatch){
            return res.status(400).json({errors : [{msg : 'Invalid Password'}] });
        }
        
       
        //get jsontoken
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(payload,
            config.get('secrettoken'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err)
                    throw err;
                res.json({ token })
            });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('SERVER ERROR');
    }
})
module.exports = router;