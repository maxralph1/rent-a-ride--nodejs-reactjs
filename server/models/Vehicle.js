const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vehicleSchema = new Schema({
        vehicle_type: {
            type: String, 
            required: true,
            enum: ['Sedan', 'Bike', 'Bicycle', 'SUV', 'Wagon', 'Truck', 'others'],
            default: 'Sedan'
        },
        vehicle_type_if_others: String,
        vehicle_brand: { type: String, required: true },
        vehicle_model: { type: String, required: true },
        vehicle_engine_number: { type: String, required: true },
        vehicle_identification_number: { type: String, required: true },
        vehicle_plate_number: { type: String, required: true },
        vehicle_images_paths: { type: [String], default: '' },
        vehicle_hire_rate_in_figures: Number,
        vehicle_hire_rate_currency: {
            type: String, 
            required: true,
            enum: ['USD', 'Euro', 'British Pound'],
            default: 'USD'
        },
        vehicle_hire_charge_per_timing: {
            type: String, 
            required: true,
            enum: ['minutes', 'seconds', 'hourly', 'days', 'negotiable'],
            default: 'minutes'
        },
        maximum_allowable_distance: String,
        status: {
            type: String, 
            required: true,
            enum: ['Available', 'Maintenance', 'Rented', 'Reserved'],
            default: 'Available'
        },
        ratings: {
            type: Map,
            of: String,
            default: {}
        },
        comments: {
            type: Map,
            of: String,
            default: {}
        },
        verified: { type: Date, default: false },
        company_owned: { type: Boolean, default: false },
        added_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        active: { type: Boolean, default: true },
        deleted_at: String
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


module.exports = mongoose.model('Vehicle', vehicleSchema);