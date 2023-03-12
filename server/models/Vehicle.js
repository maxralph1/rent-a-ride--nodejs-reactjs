const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const vehicleSchema = new Schema({
        vehicle_brand: { type: String, required: true },
        vehicle_model: { type: String, required: true },
        status: {
            type: String, 
            required: true,
            enum: ['Available', 'Maintenance', 'Rented', 'Reserved'],
            default: 'Available'
        },
        paid: Boolean,
        due_back: { type: Date, default: Date.now },
        added_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        company_owned: Boolean
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

vehicleSchema.virtual('url').get(function () {
    return `/vehicles/${this.vehicle_brand}/${this._id}`
});


module.exports = mongoose.model('Vehicle', vehicleSchema);