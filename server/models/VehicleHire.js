const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vehicleHireSchema = new Schema({
        release: {
            date: String,
            time: String,
        },
        due_back: { 
            date: { type: String, default: Date.now }, 
            time: String 
        },
        return: Date, 
        vehicle_hire_rate_due_in_figures: Number,
        vehicle_hire_rate_due_currency: {
            type: String, 
            required: true,
            enum: ['USD', 'Euro', 'British Pound'],
            default: 'USD'
        },
        paid: { type: Boolean, default: false },
        vehicle_hire_charge_timing: {
            type: String, 
            required: true,
            enum: ['minutes', 'seconds', 'hourly', 'days'],
            default: 'minutes'
        },
        hiree: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        hirer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true }, 
        booked_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        booking_updated_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        deleted_at: String
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


module.exports = mongoose.model('vehicleHire', vehicleHireSchema);