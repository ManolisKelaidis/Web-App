
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const {places,descriptors} = require('./seedHelper')



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

const sample = array => array[Math.floor(Math.random()*array.length)];


const seedDB = async () =>{
    await Campground.deleteMany({});
    for(let i = 0;i<50;i++)
    {
        const rand = Math.floor(Math.random()*1000)
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            location:`${cities[rand].city},${cities[rand].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            image:"https://source.unsplash.com/collection/483251",
            description:"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Numquam autem iure blanditiis nesciunt officiis sunt provident quod voluptatum distinctio, totam quo. Voluptates quae placeat architecto ipsam quod? Officiis, magnam tempora?",
            
            price: price
        })
        await camp.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})