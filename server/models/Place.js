const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    photos: [{
        type: String
    }],
    description: {
        type: String,
        required: true
    },
    perks: [{
        type: String
    }],
    extraInfo: {
        type: String
    },
    checkIn: {
        type: Number,
        requried: true
    },
    checkOut: {
        type: Number,
        requried: true
    },
    maxGuests: {
        type: Number,
        requried: true
    },
    price: {
        type: Number,
        requried: true
    }
})

module.exports = mongoose.model('Place', placeSchema)