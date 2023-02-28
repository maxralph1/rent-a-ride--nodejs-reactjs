const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const paymentSchema = new Schema({
        vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

paymentSchema.virtual('url').get(function () {
    return `/payments/${this.vehicle.vehicle_brand}`
});

module.exports = mongoose.model('Payment', paymentSchema);