const mongoose = require('mongoose')

const placeSchema = mongoose.Schema({
    mapId: {
        type: String,
        required: true,
        default: ""
    },
    city: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    zip: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        required: false,
    },
    body: {
        type: String,
        required: false,
    },
    img: [{
        name: {
            type: String,
            required: false,
            default: ""
        },
        size: {
            type: String,
            required: false,
            default: ""
        },
        type: {
            type: String,
            required: false,
            default: ""
        },
        file: {
            type: String,
            required: false,
            default: ""
        }
    }],
    lat: {
        type: String,
        required: true,
    },
    long: {
        type: String,
        required: true,
    },
    begin: {
        type: String,
        required: false,
    },
    end: {
        type: String,
        required: false,
    },
}, {
    timestamps: true
})

const Place = mongoose.model('Place', placeSchema)

module.exports = Place