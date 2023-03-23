const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// This is for API requests from the user device. This sends automated API requests to update the user's current location every 180 seconds. 
// We use Google Location API for the accurate location details. 
const userLocationSchema = new Schema({
        address: String,
        latitude: String,
        longitude: String,
        plus_code: String,
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        deleted_at: String
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


module.exports = mongoose.model('UserLocation', userLocationSchema);