const campground = require('../Models/campground');
const { cloudinary } = require('../cloudinary');
module.exports.index = async (req, res) => {
    const campgrounds = await campground.find({});
    res.render('campgrounds/index', { campgrounds });
};

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
geocoder = mbxGeocoding({ accessToken: mapboxToken });//contains forward and reverse geocoding 


module.exports.renderNewForm = (req, res) => {
    // if (!req.isAuthenticated()) {
    //     req.flash('error', 'you must be signed in!');
    //     return res.redirect('/login')
    // }
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
    }).send()

    const camp = await new campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry;
    camp.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', 'successfuly made a new Campground!');
    res.redirect('/campgrounds');
}

module.exports.showCampground = async (req, res) => {
    const foundCampground = await campground.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: 'author'
        }
    }).populate("author");
    if (!foundCampground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { foundCampground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundCampground = await campground.findById(id);
    // if (!req.user || !foundCampground.author.equals(req.user._id)) {
    //     req.flash('error', 'You do not have Permission to update!!');
    //     return res.redirect(`/campgrounds/${id}`);
    // }

    if (!req.user) {
        req.flash('error', 'You do not have Permission to update!!');
        return res.redirect(`/campgrounds/${id}`);
    }

    if (!foundCampground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { foundCampground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campgroundBody = req.body;

    // const foundCampground = await campground.findById(id).populate("reviews");
    // if (!req.user || !foundCampground.author.equals(req.user._id)) {
    //     req.flash('error', 'You do not have Permission to update!!');
    //     return res.redirect(`/campgrounds/${id}`);
    // }
    const foundCampground = await campground.findByIdAndUpdate(id, campgroundBody.campground);
    foundCampground.image.push(...req.files.map(f => ({ url: f.path, filename: f.filename })));
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await foundCampground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } });
    }
    await foundCampground.save();
    // const campgrounds = await campground.find({});
    req.flash('success', 'Successfully Update Campground!!');
    // res.render('campgrounds/show', { foundCampground });
    res.redirect(`/campgrounds/${foundCampground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    await campground.findByIdAndDelete(id);
    req.flash('success', 'deleted a Campground Successfully!');
    res.redirect('/campgrounds');
}