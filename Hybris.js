const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const methodOverride = require('method-override');
const Campground = require('./models/campground');


mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home')
});
app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const foundCampground = new Campground(req.body.campground);
    await foundCampground.save();
    res.redirect(`/campgrounds/${foundCampground._id}`)
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const foundCampground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { foundCampground });
})

app.get('/campgrounds/:id', async (req, res,) => {
    const foundCampground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { foundCampground });
});



app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const foundCampground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${foundCampground._id}`)
});
app.delete('/campgrounds/:id', async (req, res) => {
    console.log('here1');
    const { id } = req.params;
    console.log('here2');
    // await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
});



app.listen(8080, () => {
    console.log('Serving on port 3000')
})