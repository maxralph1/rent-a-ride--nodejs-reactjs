const User = require('../../models/User');


const getAuthUserProfile = async (req, res) => {
    if (!req.user_id) {
        return res.status(403).json({ message: "You do not have permission to access another user's profile" })

    } else if (req.user_id) {
        const user = await User.findOne({ _id: req.user_id })
            .select(['-password', '-email_verified', '-soft_deleted', '-active', '-created_by', '-created_at', '-updated_at'])
            .lean();
        res.status(200).json({ data: user });
    }
}


module.exports = { getAuthUserProfile }