const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const verifyMailLinkAuthenticateSchema = require('../../requestValidators/auth/verifyMailLinkAuthenticateValidator')


/**
 * @apiGroup Auth
 * @apiPermission public
 * @api {post} /api/v1/auth/verify-email/:user/:token Verify Newly Registered User Email
 * @apiName VerifyRegisteredUserEmail
 * 
 * @apiParam {Number} user Users unique ID.
 * @apiParam {Number} token Unique token received via email.
 * 
 * @apiDescription This verifies the registration link of the newly registered user.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Email verified sucessfully"
 *     }
 * 
 * @apiError PasswordResetErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Validation Failed
 *     {
 *       "message": "Validation failed.",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "Invalid/expired link"
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured"
 *       "details": "..."
 *     }
 */
const verifyMailLinkAuthenticate = asyncHandler(async (req, res) => {
    try {
        try {
            validatedData = await verifyMailLinkAuthenticateSchema.validateAsync({ username: req.params.username, 
                                                                                token: req.params.token })
        } catch (error) {
            return res.status(400).json({ message: "Validation failed", details: `${error}` })
        }

        const user = await User.findOne({ username: validatedData.username, email_verify_token: validatedData.token }).exec();
        if (!user) return res.status(400).send("invalid/expired link");

        try {
            jwt.verify(user.email_verify_token, process.env.EMAIL_VERIFY_TOKEN_SECRET);
        } catch(err) {
            return res.status(400).send("Verification failed");
        }

        user.email_verified = new Date().toISOString();;
        user.email_verify_token = '';

        await user.save();

        res.json({ message: "Email verified sucessfully" });
    } catch (error) {
        res.status(400).json({ message: "An error occured", details: `${error}` });
    }
});


module.exports = { verifyMailLinkAuthenticate }