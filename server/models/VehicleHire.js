const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vehicleHireSchema = new Schema({
        released: {
            date: Date,
            time: String,
        },
        due_back: { 
            date: { type: Date, default: Date.now }, 
            time: String 
        },
        returned: {
            date: Date,
            time: String
        },
        paid: { type: Boolean, default: false },
        vehicle_hire_charge_frequency: {
            type: String, 
            required: true,
            enum: ['minutes', 'seconds', 'hourly', 'days'],
            default: 'minutes'
        },
        hiree: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        hirer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
        deleted_at: String,
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


module.exports = mongoose.model('vehicleHire', vehicleHireSchema);