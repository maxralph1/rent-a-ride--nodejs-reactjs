const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const verifyMailLinkAuthenticateSchema = require('../../requestValidators/auth/verifyMailLinkAuthenticateValidator')


const verifyMailLinkAuthenticate = async (req, res) => {
    try {
        try {
            validatedData = await verifyMailLinkAuthenticateSchema.validateAsync({ username: req.params.username, 
                                                                                token: req.params.token })
        } catch (error) {
            return res.status(400).json({ message: "Validation failed", details: `${error}` })
        }

        const user = await User.findOne({ username: validatedData.username, email_verify_token: validatedData.token }).exec();
        if (!user) return res.status(400).send("invalid/expired link");

        try {
            jwt.verify(user.email_verify_token, process.env.EMAIL_VERIFY_TOKEN_SECRET);
        } catch(err) {
            return res.status(400).send("Verification failed");
        }

        user.email_verified = new Date().toISOString();;
        user.email_verify_token = '';

        await user.save();

        res.json({ message: "Email verified sucessfully" });
    } catch (error) {
        res.status(400).json({ message: "An error occured", details: `${error}` });
    }
};


module.exports = { verifyMailLinkAuthenticate }