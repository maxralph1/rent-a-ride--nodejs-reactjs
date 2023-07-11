const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
        username: { type: String, minLength: 3, maxLength: 30, required: true },
        password: { type: String, required: true },
        first_name: { type: String, minLength: 1, maxLength: 30 },
        other_names: { type: String, minLength: 1, maxLength: 30 },
        last_name: { type: String, minLength: 1, maxLength: 30 },
        user_image_path: { 
            public_id: { type: String, default: '' },
            url: { type: String, default: '' }
        },
        enterprise_name: { type: String, minLength: 1, maxLength: 100 },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        id_type: String,
        id_number: String,
        user_identification_image_path: { 
            public_id: { type: String, default: '' },
            url: { type: String, default: '' }
        }, 
        date_of_birth: Date,
        address: { type: String, required: true }, 
        roles: { type: String, default: 'level1' },
        email_verified: Date,
        password_reset_token: String,
        email_verify_token: String,
        active: { type: Boolean, default: true },
        verified: { type: Boolean, default: false },
        ratings: {
            type: Map,
            of: String,
            default: {}
        },
        comments: {
            type: Map,
            of: String,
            default: {}
        },
        created_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
        online: { type: Boolean, default: false }, 
        show_online_status: { type: Boolean, default: true },
        last_time_active: String,
        deleted_at: { type: String, default: null }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}


module.exports = mongoose.model('User', userSchema);