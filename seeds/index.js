const mongoose = require('mongoose');
const ibtinformation = require('./ibtinformation');
const { excersises, descriptors } = require('./seedHelpers');
const IbtImage = require('../models/ibtImage');


mongoose.connect('mongodb://localhost:27017/funkisMappa', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await IbtImage.deleteMany({});
    for (let i = 0; i < 5; i++) {
        const random5 = Math.floor(Math.random() * 5);
        const ibtImage = new IbtImage({
            author: '628ba5c1db9c2b63ff310371',
            title: `${sample(descriptors)} ${sample(excersises)}`,
            description: `${ibtinformation[random5].card}, ${ibtinformation[random5].description}`,
            image: 'https://i.pinimg.com/564x/df/b4/e6/dfb4e647fcf923d84e97c6e036b3a3b0.jpg'
        })
        await ibtImage.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})