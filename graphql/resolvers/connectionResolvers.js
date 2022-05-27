const Connection = require('../../models/Connection')
const User = require('../../models/User')
const Chat = require('../../models/Chat')
const Map = require('../../models/Map')
const Message = require('../../models/Message')
const Place = require('../../models/Place')
const auth = require('../../utils/auth')

module.exports = {
    Query: {
        async connectionCheck(_, __, {token}) {
 
            try {
                const { id } = auth(token)
                
                const user = await User.findById(id).populate('connections').populate({ path: 'connections', populate: 'chat map' })
                return user
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async requestConnection(_,{partnerId}, {token}){

            try {
                const { id } = auth(token)

                const newConnection = new Connection({
                    connectionType: "partner",
                    persons: [id, partnerId],
                    status: "pending",
                    requester: id
                })

                const res = await newConnection.save()

                //adding the Connection-ID to the User profile
                await User.findOneAndUpdate({_id: id}, {$push: {connections: res._id}})
                //adding the Connection_ID to the partner's profile
                await User.findOneAndUpdate({_id: partnerId}, {$push: {connections: res._id}})
                //find and return the Connection
                const connection = await Connection.findOne({_id: res._id}).populate('persons')
                
                return connection
            } catch (error) {
                throw new Error(error)
            }
        },
        async acceptRequestConnection(_,{connectionId}, {token}){

            try {
                const {id} = auth(token)

                //creating a new chat
                const newChat = new Chat({
                    connection: connectionId,
                    messages: []
                })
                const newChatRes = await newChat.save()

                //creating a new map
                const newMap = new Map({
                    connection: connectionId,
                    messages: []
                })
                const newMapRes = await newMap.save()

                //Updates the connection
                const res = await Connection.findOneAndUpdate({_id: connectionId}, {status: "accepted", chat: newChatRes._id, map: newMapRes._id}).populate('persons')
                 
                return res
            } catch (error) {
                throw new Error(error)
            }
        },
        async deleteConnection(_,{connectionId}, {token}){
            
            try {
                const connection = await Connection.findById(connectionId).populate('persons').populate('chat').populate('map')
                
                //deleting all messages
                connection.chat.messages.forEach(async message => {await Message.findOneAndDelete({_id: message})})

                //deleting all places
                connection.map.places.forEach(async place => {await Place.findOneAndDelete({_id: place})})

                //deleteting the chat
                await Chat.findOneAndDelete({_id: connection.chat.id})

                //deleting the map
                await Map.findOneAndDelete({_id: connection.map.id})

                //updating users profiles
                connection.persons.forEach(async person => {await User.findOneAndUpdate({_id: person.id}, {$pull: {connection: connectionId}})})
                //deleting the connection
                await Connection.findOneAndDelete({_id: connectionId})
                
                return connection
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}