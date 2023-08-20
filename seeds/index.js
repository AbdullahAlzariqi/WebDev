const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../Models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '64d0c3efc95f6e34659c5cf7',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: [
                {
                    url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
                    filename: 'splash1'
                },
                {
                    url: 'https://images.unsplash.com/photo-1682685797507-d44d838b0ac7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxzZWFyY2h8MXx8Y2FtcGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
                    filename: 'splash1'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum labore aliquam ducimus cum ab deserunt! Labore odit impedit iste recusandae eius repudiandae adipisci perspiciatis soluta dolor, ullam aliquam sit cumque.',
            price,
            geometry: { type: "Point", coordinates: [cities[random1000].longitude, cities[random1000].latitude] }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})