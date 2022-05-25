const userResolvers = require('./userResolvers')
const chatResolvers = require('./chatResolvers')
const mapResolvers = require('./mapResolvers')

module.exports = { 
    Query: {
        ...userResolvers.Query,
        ...chatResolvers.Query,
        ...mapResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...chatResolvers.Mutation,
        ...mapResolvers.Mutation
    },
    Subscription: {
        ...chatResolvers.Subscription,
        ...mapResolvers.Subscription
    }
}