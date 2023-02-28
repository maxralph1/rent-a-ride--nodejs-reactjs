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
            level1: Number,
            level2: Number,
            level3: Number
        },
        email_verified: Date,
        refresh_token: [ String ],
        password_reset_token: String,
        email_verify_token: String
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

userSchema.virtual('url').get(function () {
    return `/users/${this.username}`;
});


module.exports = mongoose.model('User', userSchema);