const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginUserSchema = require('../../requestValidators/auth/loginUserValidator');


const loginUser = async (req, res) => {
    let validatedData;
    try {
        validatedData = await loginUserSchema.validateAsync({ username: req.body.username, 
                                                            password: req.body.password });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ username: validatedData.username }).exec();

    if (!userFound || !userFound.active) return res.status(401).json({ message: "Unauthorized" });

    if (!userFound.email_verified) return res.status(401).json({ message: "You must verify your email before you can login." })

    const match = await bcrypt.compare(validatedData.password, userFound.password);

    if (!match) return res.status(401).json({ message: "Unauthorized" })

    const accessToken = jwt.sign(
        {
            "userInfo": {
                "username": userFound.username,
                "roles": userFound.roles
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: 5 * 60 }
    );

    const refreshToken = jwt.sign(
        { "username": userFound.username }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: 60 * 60 }
    );
    
    res.cookie('jwt', refreshToken, { httpOnly: true, secure: false, sameSite: 'None', maxAge: 1 * 60 * 60 * 1000 });
    // res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 1 * 60 * 60 * 1000 });

    res.json({ accessToken });
};


module.exports = { loginUser };