const {AuthenticationError} = require('apollo-server')
const jwt = require('jsonwebtoken')

module.exports = (token) => {
    if(token){
        const cleanToken =  token.split('Bearer ')[1];
        if (token){
            try{
                const user = jwt.verify(cleanToken, process.env.SECRET_KEY);
                return user
            } catch(err){
                throw new AuthenticationError('Invalid/Expired token')
            }
        }
        throw new Error('Authentication must be \'Bearer [token]')
    }
    throw new Error('Authorization header must be provided')
}