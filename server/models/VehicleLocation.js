const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// This is for API requests from the vehicle tracker placed secretly on the vehicle. This sends automated API requests to update the vehicle's current location every 60 seconds. 
// We use Google Location API for the accurate location details. 
// The device used for this, could be any lightweight embedded tracking device or raspberry.
const vehicleLocationSchema = new Schema({
        address: String,
        latitude: String,
        longitude: String,
        plus_code: String,
        vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
        deleted_at: String
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


module.exports = mongoose.model('VehicleLocation', vehicleLocationSchema);