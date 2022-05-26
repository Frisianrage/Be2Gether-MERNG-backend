const mongoose = require('mongoose')

const connectionSchema = mongoose.Schema({
    connectionType: {
        type: String,
        required: false,
        default: ""
    },
    persons: [{
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User',
            default: null
    }],
    status: {
        type: String,
        required: false,
        default: null
    },
    requester: {
        type: String,
        required: false,
        default: null
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Chat',
        default: null
    },
    map: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Map',
        default: null
    }
}, {
    timestamps: true
})

const Connection = mongoose.model('Connection', connectionSchema)

module.exports = Connection