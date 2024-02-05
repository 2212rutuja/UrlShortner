const express = require('express')
const mongoose = require('mongoose')

const ShortUrl =require('./models/shortUrl')

const app = express()
mongoose.connect('mongodb+srv://rutujabhagate22:rutuja22@cluster0.ns1dbm1.mongodb.net/')
console.log("mongoose connected")

const PORT = process.env.PORT


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

app.listen(PORT || 8080, ()=>{
    console.log(`server running on ${PORT}`)
})
