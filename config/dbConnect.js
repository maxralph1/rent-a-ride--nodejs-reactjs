const mongoose = require('mongoose');


const dbConnection = async () => {
    mongoose.set('sanitizeFilter', true);
    mongoose.set('strictQuery', false);

    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    } catch (error) {
        console.error(error);
    }
}


module.exports = dbConnection;