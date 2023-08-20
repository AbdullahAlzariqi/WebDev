const express = require('express');
const router = express.Router();
const AsyncWrapper = require('../utilities/AsyncWrapper');
const ExpressError = require('../utilities/ExpressError');
const campground = require('../Models/campground');
const Review = require('../Models/review');
const { campgroundSchema, reviewSchema } = require('../Schemas/schemas.js');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(AsyncWrapper(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, AsyncWrapper(campgrounds.createCampground));
// router.get('/', AsyncWrapper(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// router.post('/', validateCampground, isLoggedIn, AsyncWrapper(campgrounds.createCampground));


router.route('/:id')
    .get(AsyncWrapper(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, AsyncWrapper(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, AsyncWrapper(campgrounds.deleteCampground));


// router.get('/:id', isLoggedIn, AsyncWrapper(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, AsyncWrapper(campgrounds.renderEditForm));

// router.put('/:id', validateCampground, isLoggedIn, isAuthor, AsyncWrapper(campgrounds.updateCampground));

// router.delete('/:id', isLoggedIn, isAuthor, AsyncWrapper(campgrounds.deleteCampground));

module.exports = router;







//fixing logout

