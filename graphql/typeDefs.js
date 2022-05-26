const gql = require('graphql-tag')

module.exports = gql`
        type User{
            id: ID!
            firstname: String!
            lastname: String!
            email: String!
            password: String!
            isAdmin: Boolean!
            token: String!
            avatar: Image!
            connections: [Connection]
        },
        type Connection{
            id: ID!
            connectionType: String
            persons: [User]
            status: String
            requester: String
            chat: Chat
            map: Map
        },
        type Image{
            id: ID
            name: String!
            size: String!
            type: String!
            file: String!
        },
        type Chat{
            id: ID!
            connection: Connection!
            messages: [Message]
        },
        type Message{
            id: ID!
            user: User!
            content: String!
            messagetype: String!
            createdAt: Date
        },
        type Map{
            id: ID!
            connection: Connection!
            places: [Place]
        },
        type Place{
            id: ID!
            long: String!
            lat: String!
            city: String
            address: String
            country: String
            zip: String
            begin: String
            end: String
            title: String
            body: String
            img: [Image]
        },
        
        scalar Date

        input RegisterInput{
            firstname: String!
            lastname: String!
            password: String!
            confirmPassword: String!
            email: String!
        },
        input PlaceUpdateInput{
            id: ID!
            city: String!
            address: String!
            country: String!
            zip: String!
            begin: String!
            end: String!
            title: String!
            body: String!
        },
        input UserUpdateInput{
            firstname: String!
            lastname: String!
            password: String!
            confirmPassword: String!
            email: String!
        },
        input ImageInput{
            name: String!
            size: String!
            type: String!
            file: String!
        },
        input PlaceImageInput{
            placeId: ID!
            img: ImageInput
        },

        type Query{
            getAllUser: [User]!
            getUserDetails: User!
            getUserById: User!
            getUserByEmail(email: String!): User!
            getChat(chatId: ID!): Chat!
            getMessages: [Message]!
            getMap(mapId: ID!): Map!
            getPlace(id: ID!): Place
            getPlaceImages(id: ID!): [Image]
            connectionCheck: User
        },
        type Mutation{
            register(registerInput: RegisterInput): User!
            login(email: String!, password: String!): User!
            updateUser(updateInput: UserUpdateInput): User!
            updateAvatar(avatarInput: ImageInput!, email: String!): User!
            updatePlace(placeInput: PlaceUpdateInput!): Place!
            createMessage(content:String! messagetype: String! chatId: ID!): Message
            requestConnection(partnerId: ID!): Connection
            acceptRequestConnection(connectionId: ID!): Connection
            deleteConnection(connectionId: ID!): Connection
            createPlace(lat: String! long: String! mapId: ID!): Place
            deletePlace(placeId: ID!): Map
            addPlaceImg(placeImageInput: PlaceImageInput!): Place
            deletePlaceImg(imgId: ID! placeId: ID!): Place
        },
        type Subscription{
            newMessage: Message
            newPlace: Place
        }
`
