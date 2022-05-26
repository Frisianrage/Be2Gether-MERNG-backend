const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    chatId: {
        type: String,
        required: true,
        default: ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: false,
    },
    messagetype: {
        type: String,
        required: false,
    }
}, {
    timestamps: true
})

const Message = mongoose.model('Message', messageSchema)

module.exports = Message