const express = require('express');
const app = express();
const mongoose = require('mongoose')
const shortid = require('shortid')
const path = require('path');
const ShortUrls = require('./models/shorturls')
require('dotenv').config();

mongoose.connect(`mongodb+srv://Chin2:${process.env.DB_PASSWORD}@cluster0.brshx.mongodb.net/url-shortner?retryWrites=true&w=majority`,{ useNewUrlParser: true , useUnifiedTopology:true})
.then((result)=> console.log(`db connected...`))
.catch((err)=> console.log(err));

const PORT = process.env.PORT || 8000;


app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:false}))

app.get("/", (req,res)=>{
    res.render('index.ejs')
})

let mainId = "";
let mainUrl = "";
app.get("/link", async (req,res)=>{
    res.render('link.ejs', {shorturls : mainId, url: mainUrl})
    mainId = "";
    mainUrl = "";
})

app.get('/checkBacklink', (req,res)=>{
    const backlink = req.query.backlink;
    ShortUrls.findOne({short : backlink})
    .then(doc => {
        if(doc){
            res.json({
                status: true,
            })
        }else{
            res.json({
                status: false,
            })
        }
    }).catch(err => {
        console.log(err)
    })
})

app.post("/shortUrls", async(req,res)=>{
    mainUrl = req.body.fullurl
    backlink = req.body.backlink
    await ShortUrls.create({
        full : mainUrl,
        short: backlink,
    });
    mainId = backlink;
    res.redirect("/link")
})

app.get('/:shortUrl', async(req,res)=>{
    const shortUrl = await ShortUrls.findOne({short: req.params.shortUrl})
    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.save();

    res.redirect(shortUrl.full)
})

app.listen(PORT, console.log(`Server started on port ${PORT}`));
