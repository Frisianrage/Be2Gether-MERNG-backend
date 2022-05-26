const mongoose = require('mongoose')

const mapSchema = mongoose.Schema({
    connection: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Connection'
    },
    places: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Place',
        default: []
    }]
}, {
    timestamps: true
})

const Map = mongoose.model('Map', mapSchema)

module.exports = Map