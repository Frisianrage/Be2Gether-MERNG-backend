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
            partner: Partner
            chat: Chat
            map: Map
        },
        type Partner{
            user: User
            status: String
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
            user: User!
            partner: User!
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
            user: User!
            partner: User!
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
            getChat: User!
            getMessages: [Message]!
            getMap: User
            getPlace(id: ID!): Place
            getPlaceImages(id: ID!): [Image]
            mapChatCheck: User
        },
        type Mutation{
            register(registerInput: RegisterInput): User!
            login(email: String!, password: String!): User!
            updateUser(updateInput: UserUpdateInput): User!
            updateAvatar(avatarInput: ImageInput!, email: String!): User!
            updatePlace(placeInput: PlaceUpdateInput!): Place!
            createChat(partnerId: ID!): Chat
            createMessage(content:String! messagetype: String!): Message
            requestConnection(partnerId: ID!): User
            acceptRequestConnection(partnerId: ID!): User
            deleteConnection(partnerId: ID!): User
            createMap(partnerId: ID!): Map
            createPlace(lat: String! long: String!): Place
            deletePlace(placeId: ID!): Map
            addPlaceImg(placeImageInput: PlaceImageInput!): Place
            deletePlaceImg(imgId: ID! placeId: ID!): Place
        },
        type Subscription{
            newMessage: Message
            newPlace: Place
        }
`
