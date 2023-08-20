const User = require('../Models/user');
const campground = require('../Models/campground');
const Review = require('../Models/review');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'welcome to Yelp Camp!');
            res.redirect('/campgrounds')
        })

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back!!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl)
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}