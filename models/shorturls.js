const mongoose = require('mongoose')


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