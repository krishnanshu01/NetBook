const mongoose = require('mongoose');

const config = require('config');
const { createIndexes } = require('../models/User');

const db = config.get('mongoURI');

const connectDB = async () =>{
    try{
        await mongoose.connect(db , {
            useUnifiedTopology: true,
            useNewUrlParser: true ,
            useCreateIndex: true,
            useFindAndModify: false
        }); //here i am connected
        console.log('Finally i am connected with database');
    }catch(err){
         console.log(err.message);
         process.exit(1); //here i exited when find the error
    }
}
module.exports = connectDB;