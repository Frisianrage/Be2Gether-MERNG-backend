const mongoose = require('mongoose')

const mapSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    places: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Place',
        default: []
    },]
}, {
    timestamps: true
})

const Map = mongoose.model('Map', mapSchema)

module.exports = Map