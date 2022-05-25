const Message = require('../../models/Message')
const Chat = require('../../models/Chat')
const User = require('../../models/User')
const auth = require('../../utils/auth')

module.exports = {
    Query: {
        async getChat(_, __, {token}){

            try {
                const {id} = auth(token)  
                const chat = await User.findOne({_id: id}).populate('chat').populate({path: 'chat', populate: {path: 'messages', model: 'Message'}}).populate({path: 'chat', populate: {path: 'messages', populate: {path: 'user', model: 'User'}}})

                return chat
            } catch (error) {
                console.log(error)
            }
        }
    },
    Mutation: {
        async createMessage(_, {content, messagetype}, {pubsub, token}){

            try {
                const {id} = auth(token)
                const user = await User.findOne({_id: id}).populate('chat')

                const newMessage = new Message({
                    user: user.id,
                    content,
                    messagetype
                })
                 
                //saves the single message in the db and returns message and the user 
                const res = await newMessage.save().then(message => message.populate('user').execPopulate())
                //isnerts the new message to the message array inside the chat
                await Chat.findOneAndUpdate({_id: user.chat.id},{$push: {messages: res._id}})

                pubsub.publish('NEW_MESSAGE', {newMessage})

                return res
            } catch (error) {
                throw new Error(error)
            }
        },
        async createChat(_, {partnerId}, {token}){

            try {
                const {id} = auth(token)
                const newChat = new Chat({
                    user: id,
                    partner: partnerId,
                    messages: []
                })
                const res = await newChat.save()

                //adding the Chat-ID to the User profile
                await User.findOneAndUpdate({_id: id}, {chat: res._id}).populate('chat')
                //adding the Chat_ID to the partner's profile
                await User.findOneAndUpdate({_id: partnerId}, {chat: res._id}).populate('chat')
                //find and return the chat
                const chat = await Chat.findOne({_id: res._id})
                .populate('user')
                .populate('partner')

                return chat
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Subscription: {
        newMessage: {
            subscribe: (_, __, {pubsub}) => {
                return pubsub.asyncIterator(['NEW_MESSAGE'])
            }
        }
    }
}