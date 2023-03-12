const jwt = require('jsonwebtoken');
const User = require('../../models/User');


const verifyMailLinkAuthenticate = async (req, res) => {
    try {
        // const schema = Joi.object({ password: Joi.string().required() });
        // const { error } = schema.validate(req.body);
        // if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ username: req.params.username, email_verify_token: req.params.token }).exec();
        if (!user) return res.status(400).send("invalid/expired link");

        try {
            jwt.verify(user.email_verify_token, process.env.EMAIL_VERIFY_TOKEN_SECRET);
        } catch(err) {
            return res.status(400).send("Verification failed");
        }

        user.email_verified = Date.now();
        user.email_verify_token = '';

        await user.save();

        res.json({ message: "Email verified sucessfully" });
    } catch (error) {
        res.status(400).json({ message: "An error occured", details: `${error}` });
    }
};


module.exports = { verifyMailLinkAuthenticate }