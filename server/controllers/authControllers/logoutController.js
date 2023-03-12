const User = require('../../models/User');


const logoutUser = (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: false });
    // res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });

    res.json({ message: "Cookie cleared" })
};


module.exports = { logoutUser };