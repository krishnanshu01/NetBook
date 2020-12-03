const jwt = require('jsonwebtoken');

const config = require('config');

module.exports = function(req , res , next){
    //get token header
    const token = req.header('x-auth-token');

    //check if the token exist or not
    if(!token){
        return res.status(401).json({msg : 'No token , Authraziation denied'})
    };

    //to verify
    try{
        const decode = jwt.verify(token , config.get('secrettoken'));
        req.user = decode.user;
        next();
    }catch(err){
            res.status(401).json({msg : 'Not verified'})
    }

}
