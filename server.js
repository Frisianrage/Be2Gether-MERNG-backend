//const express = require('express')
//const http = require('http')
//const {ApolloServer} = require('apollo-server-express')
const {ApolloServer, PubSub} = require('apollo-server')
const dotenv = require('dotenv')
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

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
    })