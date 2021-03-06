const express = require('express');

const app = express();

const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const path = require('path');

connectDB();

app.use(express.json({extended : false}));  // to use body parser



app.use('/api/users' , require('./routes/api/users'))
app.use('/api/profile' , require('./routes/api/profile'))
app.use('/api/Auth' , require('./routes/api/auth'))
app.use('/api/post' , require('./routes/api/posts'))

//server static assests in production
if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('client/build'));

    app.get('*',(req , res) => {
        res.sendFile(path.resolve(__dirname,'client','build','index.html' ));
    });
}

app.listen(PORT, () =>{
    console.log(`its working on port number ${PORT}`)
});