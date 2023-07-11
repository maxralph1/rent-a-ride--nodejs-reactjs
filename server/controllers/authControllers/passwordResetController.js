const asyncHandler = require('express-async-handler');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const mailPasswordResetLinkSchema = require('../../requestValidators/auth/mailPasswordResetLinkValidator');
const verifyMailedPasswordResetLinkSchema = require('../../requestValidators/auth/verifyMailedPasswordResetLinkValidator')
const sendMail = require('../../mails/sendMail');
const passwordResetMailTemplate = require('../../mails/templates/passwordResetMail');


/**
 * @apiGroup Auth
 * @apiPermission public
 * @api {post} /api/v1/auth/password-reset Reset User Password
 * @apiName ResetUserPassword
 * 
 * @apiDescription This resets the password of an existing user.
 * 
 * @apiBody {String} email       Email of the user.
 * @apiExample {json} Request Body:
 *     {
 *       "email": "johnsnow@email.com",
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Password reset link has been sent to your email if you have an account with us"
 *     }
 * 
 * @apiError PasswordResetErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Validation Failed
 *     {
 *       "message": "Validation failed.",
 *       ...
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured"
 *       "details": "..."
 *     }
 */
const mailPasswordResetLink = asyncHandler(async (req, res) => {
    try {

        let validatedData;
        try {
            validatedData = await mailPasswordResetLinkSchema.validateAsync({ email: req.body.email })
        } catch (error) {
            return res.status(400).json({ message: "Validation failed", details: `${error}` })
        }

        const user = await User.findOne({ email: validatedData.email }).exec();
        if (!user) return res.status(400).json({ message: "Password reset link has been sent to your email if you have an account with us" });  // although this stops the process and does not send a verification email, it is done for security purposes in order not to expose to the potential harmful user, the existence of an account. We could consider removing the last line, "if you have an account with us" or decide to inform them that they do not have an account with us.
        
        const passwordResetToken = jwt.sign(
            { "email": user.email }, 
            process.env.PASSWORD_RESET_TOKEN_SECRET, 
            { expiresIn: 10 * 60 }
        );

        user.password_reset_token = passwordResetToken;
        await user.save();

        const mailSubject = "Password Reset Request Link";

        const mailBody = passwordResetMailTemplate(user);
        await sendMail(process.env.EMAIL_ADDRESS, user.email, mailSubject, mailBody);

        res.status(200).json({ message: "Password reset link has been sent to your email if you have an account with us" });
    } catch (error) {
        res.status(400).json({ message: "An error occured", details: `${error}` });
    }
});

/**
 * @apiGroup Auth
 * @apiPermission public
 * @api {post} /api/v1/auth/password-reset/:user/:token Verify Password Reset Link
 * @apiName VerifyPasswordReset
 * 
 * @apiParam {Number} user Users unique ID.
 * @apiParam {Number} token Unique token received via email.
 * 
 * @apiDescription This verifies the password reset link.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": "Password reset sucessfully"
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
const verifyMailedPasswordResetLink = asyncHandler(async (req, res) => {
    try {
        
        let validatedData;
        try {
            validatedData = await verifyMailedPasswordResetLinkSchema.validateAsync({ username: req.params.username, 
                                                                                    token: req.params.token, 
                                                                                    password: req.body.password })
        } catch (error) {
            return res.status(400).json({ message: "Validation failed", details: `${error}` })
        }

        const user = await User.findOne({ username: validatedData.username, password_reset_token: validatedData.token }).exec();

        if (!user) return res.status(400).json({ message: "Invalid/expired link" });

        try {
            jwt.verify(
                user.password_reset_token, 
                process.env.PASSWORD_RESET_TOKEN_SECRET
            );
        } catch(error) {
            return res.status(400).json({ message: "Invalid/expired link", details: `${error}` });
        }

        user.password = validatedData.password;
        user.password_reset_token = '';
        await user.save();

        res.json({ message: "Password reset sucessfully" });
    } catch (error) {
        res.status(400).json({ message: "An error occured", details: `${error}` });
    }
});


module.exports = { 
    mailPasswordResetLink, 
    verifyMailedPasswordResetLink 
};