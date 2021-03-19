const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Campground = require('../models/campground')
const Joi = require('joi')
const {isLoggedIn} = require('../middleware.js')



const validateCampground = (req,res,next) => {
    const campgroundSchema = Joi.object({
        campgrounds: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0),
            image: Joi.string().required(),
            location:Joi.string().required(),
            description:Joi.string().required()



        }).required()
    })

    const {error} = campgroundSchema.validate(req.body)
    const result = campgroundSchema.validate(req.body)
    console.log(result)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
}

router.get('/', async(req,res)=>{
    const camps = await Campground.find({})
    res.render('index',{camps})
})

router.get('/new',isLoggedIn , async (req,res) =>{
    if(!req.isAuthenticated())
    {
        req.flash('error','Πρεπει να συνδεθεις για να συνεχισεις')
        return res.redirect('/login')
    }
   
    res.render('new')
    
})

router.post('/' , validateCampground,catchAsync (async (req,res) =>
{   
    
    
    
    const campground = new Campground(req.body.campgrounds)

    console.log(req.body)
    await   campground.save()
    req.flash('success','Added a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
   
    
}))


router.get('/:id',async (req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findById(id)

    res.render('show',{camp})
})


router.get('/:id/edit',async (req,res) =>{
    const {id} = req.params;
    const camp = await Campground.findById(id)

    res.render('edit',{camp})
})


router.put('/:id',validateCampground, catchAsync (async(req,res) =>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,req.body.campgrounds)
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id',  async (req,res) => {
    const {id} = req.params
    await  Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

module.exports = router;