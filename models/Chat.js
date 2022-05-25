const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
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
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Message'
    },]
}, {
    timestamps: true
})

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat