const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {UserInputError} = require('apollo-server')
const {validateRegisterInput, validateLoginInput} = require('../../utils/validators')
const auth = require('../../utils/auth')
const User = require('../../models/User')

const generateToken = (user) => {
    loggedUser = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        connections: user.connections
    }
    return jwt.sign(loggedUser, process.env.SECRET_KEY, {expiresIn: '12h'}) 
}

module.exports = {
    Query: {
        async getUserDetails(_, __, {token}){

            try {
                const {id} = auth(token)
                const user = await User.findOne({_id: id}).populate('connections').populate( { path: 'connections', populate: 'persons' })
               
                return user
            } catch (error) {
                throw new Error(error)
            } 
        },
        async getUserById(_, {userId}){

            try {
                const user = await User.findOne({_id: userId}).populate('partner').populate({ path: 'partner', populate: 'user' })
                return user
            } catch (error) {
                throw new Error(error)
            } 
        },
        async getUserByEmail(_, {email}){

            try {
                const user = await User.findOne({email})
                return user
            } catch (error) {
                throw new Error(error)
            }
        },
        async getAllUser() {

            try {
                const users = await User.find()
                return users
            } catch (error) {
                throw new Error(error)
            }
        }
    },
    Mutation: {
        async login(_, {email, password}){

            try {
                const {errors, valid} = validateLoginInput(email, password)

                if(!valid){
                    throw new UserInputError('Errors', {errors})
                }

                const user = await User.findOne({email}).populate('connections').populate( { path: 'connections', populate: 'persons' })
                
                if(!user){
                    errors.general = 'User not found'
                    throw new UserInputError('User not found', {errors})
                }

                const match = await bcrypt.compare(password, user.password)
                if(!match){
                    errors.general = 'Wrong credententials'
                    throw new UserInputError('Wrong credententials', {errors})
                }

                const token = generateToken(user)
                return {
                    ...user._doc,
                    id: user._id,
                    token
                } 
            } catch (error) {
                throw new Error(error)
            }
        },
        async register(parent, {registerInput: {firstname, lastname, email, password, confirmPassword}}, context, info){

            try {
                // Validate user data
                const {valid, errors} = validateRegisterInput(email, password, confirmPassword)
                if(!valid){
                    throw new UserInputError('Errors', {errors})
                }
                // Make sure user doesn't already exist
                const user = await User.findOne({email})
                if(user){
                    throw new UserInputError('User already exists', {
                        errors: {
                            email: 'This email is already taken'
                        }
                    })
                }
                // hash the password and create an auth token
                password = await bcrypt.hash(password, 12)

                const newUser = new User({
                    firstname,
                    lastname,
                    password,
                    email
                })

                const res = await newUser.save()
                
                const token = generateToken(res)
                
                return {
                    ...res._doc,
                    id: res._id,
                    token
                } 
            } catch (error) {
                throw new Error(error)
            }
            
        },
        async updateUser(parent, {updateInput: {firstname, lastname, email, password, confirmPassword}}, context, info){

            try {
                 // Find user
                const user = await User.findOne({email})
                if(!user){
                    throw new UserInputError('User not found', {
                        errors: {
                            user: "Can't find a User"
                        }
                    })
                }

                //Update user
                if(user) {
                    user.firstname = firstname || user.firstname
                    user.lastname = lastname || user.lastname
                    user.email = email || user.email

                    if(password) {
                        if(password === confirmPassword) {
                            
                            // hash the password and create an auth token
                            password = await bcrypt.hash(password, 12)

                            user.password = password || user.password
                        } else {
                            throw new UserInputError("Passwords don't match", {
                                errors: {
                                password: "Passwords do not match"
                                }
                            }) 
                        }  
                    }
                    
                } 

                const res = await user.save()

                return {
                    ...res._doc,
                    id: res._id,
                } 
            } catch (error) {
                throw new Error(error)
            }
        },async updateAvatar(parent, {email, avatarInput: {name, size, type, file}}, context, info){
            
            try {
                // Find user
                const user = await User.findOne({email})
                if(!user){
                    throw new UserInputError('User not found', {
                        errors: {
                            user: "Can't find a User"
                        }
                    })
                }
            
                //Update user
                if(user) {
                    user.avatar.name = name || user.avatar.name 
                    user.avatar.type = type || user.avatar.type
                    user.avatar.size = size || user.avatar.size
                    user.avatar.file = file || user.avatar.file               
                } 

                const res = await user.save()

                return {
                    ...res._doc,
                    id: res._id,
                } 
            } catch (error) {
                throw new Error(error)
            }
        }
    }
}