const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const loginUserSchema = require('../../requestValidators/auth/loginUserValidator');
const User = require('../../models/User');

/**
 * @apiGroup Auth
 * @apiPermission public
 * @api {post} /api/v1/auth/login Login User
 * @apiName LoginUser
 * 
 * @apiDescription This authenticates an existing user.
 * 
 * @apiBody {String} username_email       Username or email of the user.
 * @apiBody {String} password          Password of the user.
 * @apiExample {json} Request Body:
 *     {
 *       "username_email": "testinguser1",
 *       "password": "testinguserpassword",
 *     }
 * 
 * OR
 * 
 *     {
 *       "username_email": "johnsnow@email.com",
 *       "password": "testinguserpassword",
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "accessToken": "b8bea17cdebf38894874964ffd88cecb1859be90df2a02f616250f22468d1eac64302a4cbf3"
 *     }
 * 
 * @apiError LoginErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Validation Failed
 *     {
 *       "message": "Validation failed."
 *     }
 * 
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized"
 *     }
 * 
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "You must verify your email before you can login."
 *     }
 */
const loginUser = asyncHandler(async (req, res) => {
    let validatedData;
    try {
        validatedData = await loginUserSchema.validateAsync({ username_email: req.body.username_email, 
                                                            password: req.body.password });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({$or: [{username: validatedData.username_email}, {email: validatedData.username_email}]}).exec();

    const match = await userFound.matchPassword(validatedData.password);

    if (!match) return res.status(401).json({ message: "Unauthorized" })

    if (!userFound?.active) return res.status(401).json({ message: "Unauthorized" });

    if (!userFound.email_verified) return res.status(401).json({ message: "You must verify your email before you can login." })

    if (userFound) { 
        userFound.online = true;
        userFound.last_time_active = '';
    }

    const accessToken = jwt.sign(
        {
            "userInfo": {
                "user_id": userFound._id,
                "username": userFound.username, 
                "first_name": userFound.first_name, 
                "other_names": userFound.other_names,
                "last_name": userFound.last_name,
                "user_image": userFound.user_image_path.url,
                "enterprise_name": userFound.enterprise_name, 
                "email": userFound.email, 
                "phone": userFound.phone, 
                "id_type": userFound.id_type, 
                "id_number": userFound.id_number, 
                "user_identification_image": userFound.user_identification_image_path.url, 
                "date_of_birth": userFound.date_of_birth, 
                "address": userFound.address, 
                "roles": userFound.roles, 
                "verified": userFound.verified, 
                "ratings": userFound.ratings, 
                "comments": userFound.comments, 
            }
        }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: 5 * 60 }
    );

    const refreshToken = jwt.sign(
        { "user_id": userFound._id }, 
        process.env.REFRESH_TOKEN_SECRET, 
        { expiresIn: 60 * 60 }
    );

    userFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.cookie('jwt', refreshToken, { 
            httpOnly: true, 
            secure: false, 
            sameSite: 'None', 
            maxAge: 1 * 60 * 60 * 1000 
        });
        // res.cookie('jwt', refreshToken, { 
        //     httpOnly: true, 
        //     secure: true, 
        //     sameSite: 'None', 
        //     maxAge: 1 * 60 * 60 * 1000 
        // });

        res.json({ accessToken });
    });
});


module.exports = { loginUser };