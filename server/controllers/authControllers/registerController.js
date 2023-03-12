const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const sendMail = require('../../mails/sendMail');
const registerEmailConfirmMailTemplate = require('../../mails/templates/registerEmailConfirmMail');
const registerUserSchema = require('../../requestValidators/auth/registerUserValidator');


const registerUser = async (req, res) => {
    try {
        const value = await registerUserSchema.validateAsync({ username: req.body.username, 
                                                    email: req.body.email,
                                                    password: req.body.password,
                                                    type: req.body.type });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const { username, email, password, type } = req.body;

    const duplicateUsername = await User.findOne({ username }).exec();
    const duplicateEmail = await User.findOne({ email }).exec();

    if (duplicateUsername) {
        return res.status(409).json({ message: `Username ${duplicateUsername.username} already exists` });
    } else if (duplicateEmail) {
        return res.status(409).json({ message: `User email ${duplicateEmail.email} already exists` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailVerifyToken = jwt.sign(
        { "username": req.body.username }, 
        process.env.EMAIL_VERIFY_TOKEN_SECRET, 
        { expiresIn: 120 * 60 }
    );

    let accountType;

    if (!type) {
        accountType = { "level1": 1000 };
    } else if (type && type == 'individual') {
        accountType = { "level1": 1000 };
    } else if (type && type == 'business') {
        accountType = { "level2": 2000 };
    } else if (type && type == 'individual', 'business') {
        accountType = { "level1": 1000, "level2": 2000 };
    }

    const user = await new User({
        username, 
        email, 
        password: hashedPassword, 
        roles: accountType, 
        email_verify_token: emailVerifyToken
    });

    user.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ message: `User ${user.username} created` });
    });

    (async function () {
        const mailSubject = "New Account Registration";

        const mailBody = await registerEmailConfirmMailTemplate(user)
        await sendMail(process.env.EMAIL_ADDRESS, user.email, mailSubject, mailBody);
    })();

    // newAccountNotify();
};


module.exports = { registerUser };