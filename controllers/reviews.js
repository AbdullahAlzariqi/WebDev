const campground = require('../Models/campground');
const Review = require('../Models/review');

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const foundCampground = await campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    foundCampground.reviews.push(review);
    await review.save();
    await foundCampground.save();
    req.flash('success', 'Created a new review successfully!');
    res.redirect(`/campgrounds/${foundCampground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'deleted a Review Successfully!');
    res.redirect(`/campgrounds/${id}`)
}