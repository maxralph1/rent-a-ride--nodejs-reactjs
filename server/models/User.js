const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
        username: { type: String, minLength: 3, maxLength: 30, required: true },
        password: { type: String, required: true },
        first_name: { type: String, minLength: 1, maxLength: 30, required: true },
        last_name: { type: String, minLength: 1, maxLength: 30, required: true },
        email: { type: String, required: true },
        id_type: String,
        id_number: String,
        location: { type: String, required: true },
        date_of_birth: Date,
        picture_path: { 
            public_id: { type: String, default: '' },
            url: { type: String, default: '' }
        },
        roles: {
            type: [String],
            default: ["level1"]
        },
        email_verified: Date,
        password_reset_token: String,
        email_verify_token: String,
        active: { type: Boolean, default: true },
        deleted: { type: Boolean, default: false }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

userSchema.virtual('url').get(function () {
    return `/users/${this.username}`;
});


module.exports = mongoose.model('User', userSchema);