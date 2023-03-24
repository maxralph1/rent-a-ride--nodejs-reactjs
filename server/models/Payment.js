const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const paymentSchema = new Schema({
        payment_initiated_on: Date,
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
        hiree: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        hirer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
        vehicle_hire: { type: Schema.Types.ObjectId, ref: 'VehicleHire', required: true }, 
        paid_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        deleted_at: String
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


module.exports = mongoose.model('Payment', paymentSchema);