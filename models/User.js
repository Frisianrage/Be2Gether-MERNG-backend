const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: false,
        default: ""
    },
    lastname: {
        type: String,
        required: false,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    isOnline: {
        type: Boolean,
        required: true,
        default: false
    },
    avatar: {
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
    },
    partner: {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'User',
            default: null
        },
        status: {
            type: String,
            required: false,
            default: null
        }
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

const User = mongoose.model('User', userSchema)

module.exports = User