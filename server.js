const {ApolloServer, PubSub} = require('apollo-server')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

dotenv.config()
connectDB()

const pubsub = new PubSub()

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({ req }) => ({
        req, 
        pubsub,
        token: (req && req.headers && req.headers.authorization)
    }),
    subscriptions: {
        path: '/subscriptions',
        onConnect: () => {
            console.log('Connected')
        }
      },
}) 

server.use(cors())

const PORT = process.env.PORT || 4000

server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
    })