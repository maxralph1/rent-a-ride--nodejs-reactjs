const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vehicleSchema = new Schema({
        vehicle_brand: { type: String, required: true },
        vehicle_model: { type: String, required: true },
        vehicle_engine_number: { type: String, required: true },
        vehicle_identification_number: { type: String, required: true },
        vehicle_plate_number: { type: String, required: true },
        picture_path: { 
            public_id: { type: [String], default: [] },
            url: { type: [String], default: [] }
        },
        status: {
            type: String, 
            required: true,
            enum: ['Available', 'Maintenance', 'Rented', 'Reserved'],
            default: 'Available'
        },
        verified: { type: Date, default: false },
        active: { type: Boolean, default: true },
        company_owned: Boolean,
        added_by: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


module.exports = mongoose.model('Vehicle', vehicleSchema);