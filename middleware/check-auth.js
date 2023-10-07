const jwt = require('jsonwebtoken');
const HttpError = require("../models/http-error");

module.exports = (req, res, next) =>{
    if(req.method === 'OPTIONS'){
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
        if(!token){
            throw new Error('Authentication failed.');
        }

        // to verify we 1st: pass the token 2nd: pass the private key we used to generate the token in the users-controllers
        // we are validating the token 
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        // every request will be able to user the userData object and get the userId we extracted in the middleware
        req.userData = {userId: decodedToken.userId};
        next();
    } catch (err) {
        const error = new HttpError('Authentication failed.', 401);
        return next(error);
    }
}