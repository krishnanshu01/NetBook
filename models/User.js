const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    name : {
       type : String,
       required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    avator : {
        type : String
    },
    date : {
        type : Date,
        Default : Date.now
    }
});
module.exports = user = mongoose.model('user' , UserSchema); //takes two arguments one is file name and second is schema name