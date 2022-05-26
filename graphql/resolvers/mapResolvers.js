const Map = require('../../models/Map')
const User = require('../../models/User')
const Place = require('../../models/Place')
const auth = require('../../utils/auth')

const {UserInputError} = require('apollo-server')


module.exports = {
    Query: {
        async getMap(_,__, {token}){
            
            try {
                const {id} = auth(token)
                const map = await User.findOne({_id: id}).populate('map').populate( { path: 'map', populate: 'places' })

                return map
            } catch (error) {
                throw new Error(error)
            }
        },
        async getPlace(_,{id},__){
            
            try {
                const place = await Place.findById(id)
                
                return place
            } catch (error) {
                throw new Error(error)
            }
        },
        async getPlaceImages(_,{id},__){
            
            try {
                const {img} = await Place.findById(id)
                
                return img
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async createPlace(_, {lat, long}, {pubsub, token}){

            try {
                const {id} = auth(token)
                const {map} = await User.findOne({_id: id}).populate('map')
                
                const newPlace = new Place({
                    map: map.id,
                    lat,
                    long
                })
                
                //saves the single place in the db and returns place and the user 
                const res = await newPlace.save()
                
                //inserts the new place to the place array inside the map
                const updatedMap = await Map.findOneAndUpdate({_id: map.id},{$push: {places: res._id}})

                pubsub.publish('NEW_PLACE', {newPlace})

                return res
            } catch (error) {
                throw new Error(error)
            }
        },
        async updatePlace(parent, {placeInput: {id, body, title, city, address, country, zip, begin, end}}, context, info){
            
            try {
                // Find user
                const place = await Place.findById(id)

                // Error handler
                if(!place){
                    throw new UserInputError('Place not found', {
                        errors: {
                            user: "Can't find a place"
                        }
                    })
                }

                //Update user
                if(place) {
                    place.body = body || place.body
                    place.title = title || place.title
                    place.city = city || place.city
                    place.address = address || place.address
                    place.country = country || place.country
                    place.zip = zip || place.zip
                    place.begin = begin || place.begin
                    place.end = end || place.end   
                } 

                const res = await place.save()

                return {
                    ...res._doc,
                    id: res._id,
                }
            } catch (error) {
                throw new Error(error)
            }   
        }, 
        async addPlaceImg(_, { placeImageInput: {img, placeId} }, __){

            try {
                const place = await Place.findOneAndUpdate({_id: placeId}, {$push: {img: img}})

                return place
                
            } catch (error) {
                throw new Error(error)
            }
        },
        async deletePlaceImg(_, {imgId, placeId}, {token}){

            try {
                const place = await Place.findOneAndUpdate({_id: placeId}, {$pull: {img: {_id: imgId}}})

                return place
                
            } catch (error) {
                throw new Error(error)
            }
        },
        async deletePlace(_, {placeId}, {token}){

            try {
                const {id} = auth(token)
                const user = await User.findOne({_id: id}).populate('map')

                const newPlace = await Place.findOneAndDelete({_id: placeId})

                const map = Map.findOneAndUpdate({_id: user.map.id},{$pull: {places: placeId}}).populate('places').populate('user').populate('partner')
                
                return map
                
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Subscription: {
        newPlace: {
            subscribe: (_, __, {pubsub}) => {
                return pubsub.asyncIterator(['NEW_PLACE'])
            }
        }
    }
}