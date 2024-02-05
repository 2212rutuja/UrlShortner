require('dotenv').config();
const express = require('express')
const mongoose = require('mongoose')


const ShortUrl =require('./models/shortUrl')

const app = express()

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const Connection = async () => {
    const URL = `mongodb+srv://${username}:${password}@cluster0.ns1dbm1.mongodb.net/`;
    try {
        await mongoose.connect(URL);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error while connecting with the database', error.message);
    }
}

Connection();


app.set('view engine', 'ejs') // set the ejs file
app.use(express.urlencoded({extended:false}))

app.get('/',async(req,res)=>{
    const shortUrls = await ShortUrl.find()
    res.render('index',{shortUrls: shortUrls})
})

app.post('/shortUrls',async (req,res)=>{
    await ShortUrl.create({full:req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl',async(req,res)=>{
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
    if(shortUrl == null) return res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})

app.listen( 8080, ()=>{
    console.log(`server running on 8080`)
})
