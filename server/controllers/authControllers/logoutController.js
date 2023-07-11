const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');


/**
 * @apiGroup Auth
 * @apiPermission public
 * @api {post} /api/v1/auth/logout Logout User
 * @apiName LogoutUser
 * 
 * @apiDescription Logs out an authenticated user.
 * 
 * @apiBody {String} accessToken Access Token containing important information.
 * @apiExample {json} Request Body:
 *     {
 *       "accessToken": "b8bea17cdebf38894874964ffd88cecb1859be90df2a02f616250f22468d1eac64302a4cbf3"
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 204 
 *     {
 *       
 *     }
 */
const logoutUser = asyncHandler(async (req, res) => {

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.sendStatus(204);

    try {
        const decoded = jwt.verify(req?.cookies?.jwt, process.env.JWT_SECRET);

        let user = await User.findById(decoded.userId).exec();

        if (user) { 
            user.online = false;
            user.last_time_active = new Date().toISOString();
        }

        await user.save();
    } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
    

    res.clearCookie('jwt', { 
        httpOnly: true, 
        sameSite: 'None', 
        secure: false 
    });
    // res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' });

    res.json({ success: "Logged out successfully" });
});


module.exports = { logoutUser };