const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const passport = require('passport');
const colorse = require('colors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const session = require('express-session')

//Load env vars
dotenv.config({path: './config/config.env'});

// Connect to database
connectDB();



//passport Config
require('./middleware/passport')(passport)



//Route files
//const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/user')
const postRoute = require('./routes/postRoute')
const adminRoute = require('./routes/adminRoute')
const packageRoute = require('./routes/packageRoute')
const appAdsRoute = require('./routes/appAdsRoute')
const professionRoute = require('./routes/professionRoute')
const index = require('./routes/index')
const authRoute = require('./routes/auth')


const app = express();

//Dev logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


//Sessions 
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    cookie:{secure:true}
}))



//passport middleware
app.use(passport.initialize())
app.use(passport.session())


app.use(express.urlencoded({extended:true}));
app.use(express.json());


//Mount routers
//app.use('/api/v1/posts', postRoute);
app.use("/user",userRoute);
app.use("/posts",postRoute);
app.use("/admin",adminRoute);
app.use("/package",packageRoute);
app.use("/appAds",appAdsRoute);
app.use("/profession",professionRoute);
app.use("/",index);
app.use("/auth",authRoute);




const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //  Close server & exit process
    server.close(() => process.exit(1));
})