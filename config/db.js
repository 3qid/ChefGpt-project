const mongoose = require('mongoose');

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB via Mongoose');
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // إيقاف التطبيق إذا فشل الاتصال
    }
};

module.exports = connectToDb;