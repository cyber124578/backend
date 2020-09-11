const express = require('express')
var cors = require('cors')


const path = require('path');
const dotenv = require('dotenv');
//database connection 
const mongoose = require('mongoose');
//Router export
const bodyParser = require("body-parser");

const categoryRoutes = require('./Routes/category');  
const productRoutes = require('./Routes/product'); 
const adminRoutes = require('./Routes/admin'); 

const app = express();

app.use(cors())
app.use('*', cors())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());



//end-of Router
dotenv.config({path: './config.env'});
//database connection  Mongoose
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
});


app.use('/uploads',express.static('uploads'));


app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
app.use(express.static('public'));
//Route
app.use(categoryRoutes);
app.use(productRoutes);
app.use(adminRoutes);






//end-ofRoutes

const port = process.env.PORT;
app.listen(port,()=> {
    console.log('server is started');
})