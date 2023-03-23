const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const interationSchema = new Schema({
        message: { type: String, maxLength: 100 },
        for_vehicle: { type: Schema.Types.ObjectId, ref: 'Vehicle'},
        for_vehicle_hire: { type: Schema.Types.ObjectId, ref: 'VehicleHire'},
        added_by: { type: Schema.Types.ObjectId, ref: 'User'},
        deleted_at: String
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
)


module.exports = mongoose.model('Interaction', interationSchema);