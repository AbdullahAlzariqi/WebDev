const express = require('express');
const router = express.Router({ mergeParams: true });
const AsyncWrapper = require('../utilities/AsyncWrapper');
const ExpressError = require('../utilities/ExpressError');
const campground = require('../Models/campground');
const Review = require('../Models/review');
const { campgroundSchema, reviewSchema } = require('../Schemas/schemas.js');


const validateReview = (req, res, next) => {
    // Using joi to define  schema for this route 
    // const campgroundSchema = Joi.object({
    //     campground: Joi.object({
    //         title: Joi.string().required(),
    //         price: Joi.number().required().min(0),
    //         image: Joi.string().required(),
    //         description: Joi.string().required()
    //     }).required()
    // })
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}




// adding reviews 
router.post('/', validateReview, AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await campground.findById(id);
    const review = new Review(req.body.review);
    foundCampground.reviews.push(review);
    await review.save();
    await foundCampground.save();
    req.flash('success', 'Created a new Review Successfully!');
    res.redirect(`/campgrounds/${foundCampground._id}`);
}))

//Deleting a review 
router.delete('/:reviewId', AsyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'deleted a Review Successfully!');
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;