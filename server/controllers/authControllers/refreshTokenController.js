const User = require('../../models/User');
const jwt = require('jsonwebtoken');


const refreshTokenHandler = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: "Forbidden" });

            const userFound = await User.findOne({ _id: decoded.user_id }).exec();

            if (!userFound) return res.status(401).json({ message: "Unauthorized" })

            if (userFound) { 
                userFound.last_time_active = new Date().toISOString();
                // userFound.last_time_active = Date.now();
            }

            const accessToken = jwt.sign(
                {
                    "userInfo": {
                        "user_id": userFound._id,
                        "username": userFound.username,
                        "roles": userFound.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: 5 * 60 }
            )

            userFound.save((error) => {
                if (error) {
                    return res.status(400).json(error);
                }
                res.json({ accessToken })
            });
        }
    )
}


module.exports = { refreshTokenHandler }