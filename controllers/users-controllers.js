const { validationResult } = require('express-validator');
const uuid =  require('uuid');
const HttpError = require('../models/http-error')

const User = require('../models/user');

const getUsers = async(req, res, next) =>{
    let users;
    try {
        users =  await User.find({}, '-password');
    } catch (err) {
        const error = new HttpError(
            'Feetching users failed, please try again.', 500
        );
        return next(error)
    }

    res.json({users: users.map(user => user.toObject({getters: true}))})
}

const signup = async (req, res, next) =>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return next(
            new HttpError('Invalid inputs passed, please ccheck your data', 422)
        ) 
    }
    
    const {name, email, password} = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
        
    } catch (err) {
        const error = new HttpError(
            'Signing up faild, please try again.', 500
        );
        return next(error);
    }
    
    if(existingUser){
        const error = new HttpError(
            'User exists already, Please Login Instead', 422
        );
        return next(error);
    }


    const createdUser = new User({
        name,
        email,
        password,
        favoritePlaces: []
    })

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Login failed, please try again.', 500
        )
        return next(error);
    }
    // res.status(201).json({user: createdUser.toObject({getter: true})});
    res.status(201).json({
        message: 'Signup succesfullly!!',
        user: createdUser.toObject({ getters: true })
    });
}

const login = async (req, res, next) =>{
    const {email, password} = req.body;
    
    let existingUser;
    try {
        existingUser = await User.findOne({email: email});
    } catch (err) {
        const error = new HttpError(
            'Signing up faild, please try again.', 500
        );
        return next(error);
    }

    if(!existingUser || existingUser.password !== password){
        const error = new HttpError(
            'Invalid credentials, could not login', 401
        )
        return next(error);
    }

    res.json({
        message: 'Logged in succesfullly!!',
        user: existingUser.toObject({ getters: true })
    });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;