const express = require('express');
const router = express.Router();
const AsyncWrapper = require('../utilities/AsyncWrapper');
const ExpressError = require('../utilities/ExpressError');
const campground = require('../Models/campground');
const Review = require('../Models/review');
const { campgroundSchema, reviewSchema } = require('../Schemas/schemas.js');
const { isLoggedIn } = require('../middleware');


const validateCampground = (req, res, next) => {
    // Using joi to define  schema for this route 
    // const campgroundSchema = Joi.object({
    //     campground: Joi.object({
    //         title: Joi.string().required(),
    //         price: Joi.number().required().min(0),
    //         image: Joi.string().required(),
    //         description: Joi.string().required()
    //     }).required()
    // })
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

router.get('/', AsyncWrapper(async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, (req, res) => {
    // if (!req.isAuthenticated()) {
    //     req.flash('error', 'you must be signed in!');
    //     return res.redirect('/login')
    // }
    res.render('campgrounds/new');
});

router.post('/', validateCampground, isLoggedIn, AsyncWrapper(async (req, res, next) => {
    // if (!req.body, campground) throw new ExpressError('Paramt=etere cannot be left empty', 400

    // Using joi to define  schema for this route 
    // const campgroundSchema = Joi.object({
    //     campground: Joi.object({
    //         title: Joi.string().required(),
    //         price: Joi.number().required().min(0),
    //         image: Joi.string().required(),
    //         description: Joi.string().required()
    //     }).required()
    // })
    // const { error } = campgroundSchema.validate(req.body);
    // if (error) {
    //     const msg = error.details.map(el => el.message).join(',');
    //     throw new ExpressError(msg, 400)
    // }

    const camp = await new campground(req.body.campground);
    await camp.save();
    req.flash('success', 'successfuly made a new Campground!');
    res.redirect('/campgrounds');
}));


router.get('/:id', isLoggedIn, AsyncWrapper(async (req, res) => {
    const foundCampground = await campground.findById(req.params.id).populate("reviews");
    if (!foundCampground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { foundCampground });
}));

router.get('/:id/edit', AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await campground.findById(id);

    if (!foundCampground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { foundCampground });
}));

router.put('/:id', validateCampground, AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const campgroundBody = req.body;
    await campground.findByIdAndUpdate(id, campgroundBody.campground);
    const foundCampground = await campground.findById(id).populate("reviews");
    const foundReview = [];
    const reviewId = foundCampground.reviews;

    // const campgrounds = await campground.find({});
    req.flash('success', 'Successfully Update Campground!!');
    // res.render('campgrounds/show', { foundCampground });
    res.redirect(`/campgrounds/${foundCampground._id}`);
}));

router.delete('/:id', AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await campground.findByIdAndDelete(id);
    req.flash('success', 'deleted a Campground Successfully!');
    res.redirect('/campgrounds');
}));

module.exports = router;







//fixing logout

