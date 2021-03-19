const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const Joi = require('joi')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const flash = require('connect-flash')
const User = require('./models/user')
const passport = require('passport')
const localStrategy = require('passport-local')

const userRoutes = require('./routes/users.js')
const campgrounds = require('./routes/campgrounds.js')


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})

const db = mongoose.connection;

db.on('error',console.error.bind(console,"connection error:"));
db.once("open",() =>{
    console.log("Database Connected");
})

app.engine("ejs",ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
sessionConfig = {
    secret:'thisisasecret',
    resave: false,
    saveUninitialized: true,
    cookie:
    {   
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7

    }




}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


app.get('/fakeUser',async (req,res)=>{
    const user = new User({email:"manoliskelaidis@windowslive.com",username:"oglockhomi"})
    const newUser = await User.register(user,'dog')
    res.send(newUser)
})

app.use( (req,res,next)=>{
    res.locals.success =req.flash('success');
    res.locals.error =req.flash('error');
    next();
})


app.use('/',userRoutes)
app.use('/campgrounds',campgrounds)
app.use(express.static(path.join(__dirname,'public')))







app.get('/',(req,res)=>{ 
    res.render("home")
})


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404))
})
app.use((err,req,res,next)=>{
    const {statusCode = 500} =err;
    if(!err.message) err.message ="Soemthing went wrong"
    res.status(statusCode).render('error',{err})
})



app.listen('3000', ()=>{
    console.log('Server up')
})