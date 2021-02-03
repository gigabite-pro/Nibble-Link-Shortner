const express = require('express');
const app = express();
const mongoose = require('mongoose')
const shortid = require('shortid')
const path = require('path');
const shorturls = require('./models/shorturls');
const ShortUrls = require('./models/shorturls')
const pass = require('./models/pass')

mongoose.connect(`mongodb+srv://Chin2:${pass}@cluster0.brshx.mongodb.net/url-shortner?retryWrites=true&w=majority`,{ useNewUrlParser: true , useUnifiedTopology:true})
.then((result)=> console.log(`db connected...`))
.catch((err)=> console.log(err));

const hostname = '127.0.0.1'
const port = process.env.PORT || 5000

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:false}))

app.get("/", (req,res)=>{
    res.render('index.ejs')
})

let mainId = "";
app.get("/link", async (req,res)=>{
    res.render('link.ejs', {shorturls : mainId})
})
app.post("/shortUrls", async(req,res)=>{
    let id = await shortid.generate()
    mainId = id
    await ShortUrls.create({
        full : req.body.fullurl,
        short: id,
    });
    res.redirect("/link")
})

app.get('/:shortUrl', async(req,res)=>{
    const shortUrl = await ShortUrls.findOne({short: req.params.shortUrl})
    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.save();

    res.redirect(shortUrl.full)
})

app.listen(port,hostname, ()=>{
    console.log(`App has been started at http://${hostname}:${port}/`);
});
