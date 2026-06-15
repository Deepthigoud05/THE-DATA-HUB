const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });

        console.log("MongoDB Connected");
    } catch (error) {
        console.log("MongoDB Error:");
        console.log(error);
    }
};

module.exports = connectDB;