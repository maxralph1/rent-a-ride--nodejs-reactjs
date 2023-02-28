const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const loginUser = async (req, res) => {
    const cookies = req.cookies;

    const { username_email, password } = req.body;

    const userFound = await User.findOne({$or: [{email: username_email}, {username: username_email}]}).exec();

    if (!userFound) res.render('login', { error: 'Login failed' });

    if (!userFound.email_verified) res.render('login', { error: 'You must verify your email before you can login' });

    const match = await bcrypt.compare(password, userFound.password);

    if (match) {
        const roles = Object.values(userFound.roles);
        const accessToken = jwt.sign(
            {
                'userInfo': {
                    'username': userFound.username,
                    'roles': roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: 5 * 60 }
        );
        const newRefreshToken = jwt.sign(
            { 'username': userFound.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: 15 * 60 }
        );

        let newRefreshTokenArray = 
            !cookies?.jwt 
                ? userFound.refresh_token
                : userFound.refresh_token.filter(token => token !== cokkies.jwt);

        if (cookies?.jwt) {
            const refreshToken = cookies.jwt;
            const tokenFound = await User.findOne({ refresh_token: refreshToken }).exec();

            if (!tokenFound) {
                newRefreshTokenArray = [];
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false });
            // res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        }

        userFound.refresh_token = [...newRefreshTokenArray, newRefreshToken];

        await userFound.save();

        res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: false, maxAge: 24 * 60 * 60 * 1000 });
        // res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });

        res.redirect('/', accessToken);
    }
}