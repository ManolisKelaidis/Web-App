const express = require('express');
const router = express.Router();
const User = require('../models/user')
const catchAsync = require('../utils/catchAsync')
const passport = require('passport')


router.get('/register', async(req,res) =>{
    res.render('users/register')
})

router.post ('/register', catchAsync (async (req,res)=>{

    try{

        const {username ,email,password} = req.body
        const user = new User(({username,email}))
        const newUser = await User.register(user,password) 
        console.log(newUser)
        req.flash("success","Welcome dog")
        res.redirect('/campgrounds')
    }
    catch(e)
    {   
        console.log(e.message)
        e.message = "Υπαρχει  ηδη "
        req.flash("error", e.message)
        res.redirect('/register')
    }    

}))


router.get('/login',(req,res)=>{
    res.render('users/login')
})


router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}), (req,res)=>{
    req.flash('success','Καλως ηρθες')
    res.redirect('/campgrounds')
})


module.exports= router;