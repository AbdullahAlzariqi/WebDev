const express = require('express');
const router = express.Router();
const AsyncWrapper = require('../utilities/AsyncWrapper');
const ExpressError = require('../utilities/ExpressError');
const User = require('../Models/user');
const passport = require('passport')
const { storeReturnTo } = require('../middleware');
// const Review = require('../Models/review');
// const {  userSchema } = require('../Schemas/schemas.js');
const users = require('../controllers/users');

router.route('/register')
    .get(users.renderRegisterForm)
    .post(AsyncWrapper(users.registerUser));

// router.get('/register', users.renderRegisterForm)

// router.post('/register', AsyncWrapper(users.registerUser));

router.route('/login')
    .get(users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser)

// router.get('/login', (req, res) => {
//     res.render('users/login');
// })

// router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.loginUser)

router.get('/logout', users.logoutUser);



module.exports = router;