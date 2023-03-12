const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const locationSchema = new Schema({
        address: String
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

locationSchema.virtual('url').get(function () {
    return `/locations/${this.address}`;
});


module.exports = mongoose.model('Location', locationSchema);