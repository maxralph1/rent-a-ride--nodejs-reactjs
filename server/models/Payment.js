const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const paymentSchema = new Schema({
        payment_initiated: Date,
        payment_method: {
            type: String, 
            required: true,
            enum: ['Debit/Credit Card', 'PayPal', 'Bitcoin', 'Ethereum'],
            default: 'Debit/Credit Card'
        },
        status: {
            type: String, 
            required: true,
            enum: ['Declined', 'Pending', 'Successful'],
            default: 'Pending'
        },
        user_hiring: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        user_renting: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
        vehicle_hire: { type: Schema.Types.ObjectId, ref: 'VehicleHire', required: true }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


module.exports = mongoose.model('Payment', paymentSchema);