const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const cookiesSchema = require('../../requestValidators/auth/cookiesValidator')


const refreshTokenHandler = async (req, res) => {

    let validatedData;
    try {
        validatedData = await cookiesSchema.validateAsync({ cookies: req.cookies });
    } catch (error) {
        return res.status(400).json({ message: "Cookie validation failed", details: `${error}` });
    }

    const cookies = validatedData.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });

            const userFound = await User.findOne({ username: decoded.username }).exec();

            if (!userFound) return res.status(401).json({ message: "Unauthorized" })

            const accessToken = jwt.sign(
                {
                    "userInfo": {
                        "username": userFound.username,
                        "roles": userFound.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: 5 * 60 }
            )

            res.json({ accessToken })
        }
    )
}


module.exports = { refreshTokenHandler }