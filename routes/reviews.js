const express = require('express');
const router = express.Router({ mergeParams: true });
const AsyncWrapper = require('../utilities/AsyncWrapper');
const ExpressError = require('../utilities/ExpressError');
const campground = require('../Models/campground');
const Review = require('../Models/review');
const { campgroundSchema, reviewSchema } = require('../Schemas/schemas.js');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');






// adding reviews 
router.post('/', validateReview, isLoggedIn, AsyncWrapper(reviews.createReview))

//Deleting a review 
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, AsyncWrapper(reviews.deleteReview))

module.exports = router;