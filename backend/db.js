const mongoose = require('mongoose');
const mongooesUrl = "mongodb://localhost:27017/myDatabase1";

const connectToMongodb = async () => {
    try {
        await mongoose.connect(mongooesUrl);
        console.log("Connected to Mongodb Sucessfully");
    }
    catch (e) {
        console.log("Mongodb Connection Failed ", e.message);
    }
}

module.exports = connectToMongodb