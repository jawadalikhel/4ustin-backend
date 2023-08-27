const { validationResult } = require('express-validator');
const uuid =  require('uuid');

const DUMMY_USERS = [
    {
        id: 'u1',
        username: 'Jawad Alikhel',
        email: 'me@gmail.com',
        password: '123456'
    }
]
const getUsers = (req, res, next) =>{
    res.json({users: DUMMY_USERS});
}

const signup = (req, res, next) =>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        throw new Error('Invalid inputs passed, please ccheck your data', 422);
    }
    
    const {username, email, password} = req.body;

    const alreadyUser = DUMMY_USERS.find(user => user.email === email);
    if(alreadyUser){
        throw new Error('Could not create user, email already exists.', 422);
    }

    const createdUser = {
        id: uuid.v4(),
        username,
        email,
        password
    }

    DUMMY_USERS.push(createdUser);
    res.status(201).json({user: createdUser});
}

const login = (req, res, next) =>{
    const {email, password} = req.body;
    const identifiedUser = DUMMY_USERS.find(user => user.email === email);
    
    // if the user is not find by email OR if email is found but the password is wrong throw error
    if(!identifiedUser || identifiedUser.password !== password){
        throw new Error('Could not identify user, credentials seem to be wrong.', 401);
    }
    
    res.json({message: 'Logged in!!'});
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;