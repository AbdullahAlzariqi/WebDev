const express = require('express');
const router = express.Router({ mergeParams: true });
const AsyncWrapper = require('../utilities/AsyncWrapper');
const ExpressError = require('../utilities/ExpressError');
const campground = require('../Models/campground');
const Review = require('../Models/review');
const { campgroundSchema, reviewSchema } = require('../Schemas/schemas.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');






// adding reviews 
router.post('/', validateReview, isLoggedIn, AsyncWrapper(async (req, res) => {
    const { id } = req.params;
    const foundCampground = await campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    foundCampground.reviews.push(review);
    await review.save();
    await foundCampground.save();
    req.flash('success', 'Created a new review successfully!');
    res.redirect(`/campgrounds/${foundCampground._id}`);
}))

//Deleting a review 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, AsyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'deleted a Review Successfully!');
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;