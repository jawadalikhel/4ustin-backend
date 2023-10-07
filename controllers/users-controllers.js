const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('Could not create user, please try agin', 500);
        return next(error);
    }
    

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        favoritePlaces: []
    })

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError(
            'Signup failed, please try again.', 500
        )
        return next(error);
    }
    
    let token;
    try {
        token = jwt.sign(
            {userId: createdUser.id, email: createdUser.email}, 
            process.env.JWT_KEY, 
            {expiresIn: '1h'}
        );
    } catch (err) {
        const error = new HttpError(
            'Signup failed, please try again.', 500
        )
        return next(error);
    }

    res.status(201).json({
        userId: createdUser.id,
        email: createdUser.email,
        token: token
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

    if(!existingUser){
        const error = new HttpError(
            'Invalid credentials, could not login', 403
        )
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
            'Invalid credentials, could not login', 500
        )
        return next(error);
    }

    if(!isValidPassword){
        const error = new HttpError(
            'Invalid credentials, could not login', 403
        )
        return next(error);
    }
    
    let token;
    try {
        token = jwt.sign(
            {userId: existingUser.id, email: existingUser.email}, 
            process.env.JWT_KEY, 
            {expiresIn: '1h'}
        );
    } catch (err) {
        const error = new HttpError(
            'Login failed, please try again.', 500
        )
        return next(error);
    }

    res.json({
       userId: existingUser.id,
       email: existingUser.email,
       token: token
    });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;