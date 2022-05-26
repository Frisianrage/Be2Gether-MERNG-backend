const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    connection: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Connection'
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