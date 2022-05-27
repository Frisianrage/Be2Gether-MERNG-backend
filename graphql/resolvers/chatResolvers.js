const Message = require('../../models/Message')
const Chat = require('../../models/Chat')
const User = require('../../models/User')
const auth = require('../../utils/auth')

module.exports = {
    Query: {
        async getChat(_, {chatId}){

            try {
                  
                const chat = await Chat.findById(chatId).populate('messages').populate({path: 'messages', populate: 'user'})

                return chat
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createMessage(_, {content, messagetype, chatId}, {pubsub, token}){

            try {
                const {id} = auth(token)

                const newMessage = new Message({
                    user: id,
                    chatId,
                    content,
                    messagetype
                })
                 
                //saves the single message in the db and returns message and the user 
                const res = await newMessage.save().then(message => message.populate('user').execPopulate())
                //isnerts the new message to the message array inside the chat
                await Chat.findOneAndUpdate({_id: chatId},{$push: {messages: res._id}})

                pubsub.publish('NEW_MESSAGE', {newMessage})

                return res
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