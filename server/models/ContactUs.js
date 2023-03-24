const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const contactUsSchema = new Schema({
        title: { type: String, maxLength: 30 },
        body: { type: String, maxLength: 100 },
        name: String,
        email: String,
        deleted_at: String
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at'}
    }
);


module.exports = mongoose.model('ContactUs', contactUsSchema);