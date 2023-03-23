const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const sendMail = require('../../mails/sendMail');
const registerEmailConfirmMailTemplate = require('../../mails/templates/registerEmailConfirmMail');
const registerUserSchema = require('../../requestValidators/auth/registerUserValidator');


const registerUser = async (req, res) => {
    let validatedData;
    try {
        validatedData = await registerUserSchema.validateAsync({ username: req.body.username, 
                                                            first_name: req.body.first_name,
                                                            other_names: req.body.other_names,
                                                            last_name: req.body.last_name,
                                                            enterprise_name: req.body.enterprise_name,
                                                            email: req.body.email,
                                                            phone: req.body.phone,
                                                            id_type: req.body.id_type,
                                                            id_number: req.body.id_number,
                                                            address: req.body.address,
                                                            date_of_birth: req.body.date_of_birth,
                                                            account_type: req.body.account_type, 
                                                            password: req.body.password });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const duplicateUsername = await User.findOne({ username: validatedData.username }).lean();
    const duplicateEmail = await User.findOne({ email: validatedData.email }).lean();

    if (duplicateUsername) {
        return res.status(409).json({ message: `Username ${duplicateUsername.username} already exists` });
    } else if (duplicateEmail) {
        return res.status(409).json({ message: `User email ${duplicateEmail.email} already exists` });
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const emailVerifyToken = jwt.sign(
        { "username": req.body.username }, 
        process.env.EMAIL_VERIFY_TOKEN_SECRET, 
        { expiresIn: 20 * 60 }
    );

    let accountType;

    if (!validatedData.account_type) {
        accountType = ["level1"];
    } else if (validatedData.account_type && validatedData.account_type == "individual") {
        accountType = ["level1"];
    } else if (validatedData.account_type && validatedData.account_type == "vendor") {
        accountType = ["level2"];
    } else if (validatedData.account_type && validatedData.account_type == "individual", "vendor") {
        accountType = ["level1", "level2"];
    }

    const user = await new User({
        username: validatedData.username, 
        first_name: validatedData.first_name, 
        other_names: validatedData.other_names, 
        last_name: validatedData.last_name, 
        user_image_path: validatedData.user_image_path, 
        enterprise_name: validatedData.enterprise_name, 
        email: validatedData.email, 
        phone: validatedData.phone, 
        id_type: validatedData.id_type, 
        id_number: validatedData.id_number, 
        user_identification_image_path: validatedData.user_identification_image_path, 
        address: validatedData.address, 
        date_of_birth: validatedData.date_of_birth,  
        roles: accountType, 
        password: hashedPassword
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