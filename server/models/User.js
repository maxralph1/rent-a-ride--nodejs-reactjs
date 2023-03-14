const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
        username: { type: String, minLength: 3, maxLength: 30, required: true },
        password: { type: String, required: true },
        first_name: { type: String, minLength: 1, maxLength: 30 },
        other_names: { type: String, minLength: 1, maxLength: 30 },
        last_name: { type: String, minLength: 1, maxLength: 30 },
        enterprise_name: { type: String, minLength: 1, maxLength: 100 },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        id_type: String,
        id_number: String,
        address: { type: String, required: true },
        date_of_birth: Date,
        user_image_path: { 
            public_id: { type: String, default: '' },
            url: { type: String, default: '' }
        },
        user_identification_image_path: { 
            public_id: { type: String, default: '' },
            url: { type: String, default: '' }
        },
        role: { type: String, default: 'level1' },
        email_verified: Date,
        password_reset_token: String,
        email_verify_token: String,
        active: { type: Boolean, default: true },
        soft_deleted: Date,
        verified: { type: Boolean, default: false },
        deleted: { type: Boolean, default: false },
        created_by: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


module.exports = mongoose.model('User', userSchema);