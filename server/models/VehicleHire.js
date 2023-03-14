const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vehicleHireSchema = new Schema({
        release: {
            date: Date,
            time: String,
        },
        due_back: { 
            date: { type: Date, default: Date.now }, 
            time: String 
        },
        return: {
            date: Date,
            time: String
        },
        paid: { type: Boolean, default: false },
        user_hiring: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        user_renting: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


module.exports = mongoose.model('vehicleHire', vehicleHireSchema);