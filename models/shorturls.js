const mongoose = require('mongoose')
const shortId = require('shortid')


const shortUrls = new mongoose.Schema({
    full: {
        type: String,
        required: true
    },
    short: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('ShortUrls', shortUrls)