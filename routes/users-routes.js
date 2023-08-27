const express = require('express');
const usersController = require('../controllers/users-controllers');
const { check } = require('express-validator');
const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
    '/signup', 
    [
        check('username')
            .not()
            .isEmpty(),
        check('email')
            .normalizeEmail() // Test@test.com => test@test.com
            .isEmail(),
        check('password')
            .isLength({min: 5}) // if if the password is atleast 5 char in length
    ], 
    usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;