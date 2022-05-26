const userResolvers = require('./userResolvers')
const chatResolvers = require('./chatResolvers')
const mapResolvers = require('./mapResolvers')
const connectionResolvers = require('./connectionResolvers')

module.exports = { 
    Query: {
        ...userResolvers.Query,
        ...chatResolvers.Query,
        ...mapResolvers.Query,
        ...connectionResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...chatResolvers.Mutation,
        ...mapResolvers.Mutation,
        ...connectionResolvers.Mutation
    },
    Subscription: {
        ...chatResolvers.Subscription,
        ...mapResolvers.Subscription
    }
}