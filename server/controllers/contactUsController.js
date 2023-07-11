const ContactUs = require('../models/ContactUs');
const getContactUsSchema = require('../requestValidators/contactUs/getContactUsValidator');
const createContactUsSchema = require('../requestValidators/contactUs/createContactUsValidator');


/**
 * @apiGroup ContactUs
 * @apiPermission auth, admin
 * @api {get} /api/v1/contact-us 00. Get All Contact Us Messages
 * @apiName GetContactUsMessages
 * 
 * @apiDescription This retrieves all contact-us messages.
 *
 * @apiSuccess {String} _id     ContactUs Message ID.
 * @apiSuccess {String} title   Title of the contact us message.
 * @apiSuccess {String} name    Name of the author.
 * @apiSuccess {String} email   Email of the author.
 * @apiSuccess {String} created_at      Message creation date/time.
 * @apiSuccess {String} updated_at      Message update date/time.
 * @apiSuccess {String} deleted_at      Message deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "title": "This is the title of the message",
 *                  "name": "John Snow",
 *                  "email": "johnsnow@email.com",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no contact-us messages found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No contact-us messages found"
 *     }
 */

const getAllContactUsMessages = async (req, res) => {
    const contactUs = await ContactUs.find().sort('-created_at').lean();
    if (!contactUs?.length) return res.status(404).json({ message: "No contact-us messages found" });

    res.json({ data: contactUs });
};

/**
 * @apiGroup ContactUs
 * @apiPermission public
 * @api {post} /api/v1/contact-us 02. Create New Contact Us Message
 * @apiName CreateNewContactUsMessage
 * 
 * @apiDescription This creates a new contact us message.
 * 
 * @apiBody {String} title     Title (subject) of the message.
 * @apiBody {String} body       Message body (content).
 * @apiBody {String} email       Email of the author.
 * @apiExample {json} Request Body:
 *     {
 *        "title": "This is the title of the message",
 *        "name": "John Snow",
 *        "email": "johnsnow@email.com",
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 MessageCreated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "title": "This is the title of the message",
 *                  "name": "John Snow",
 *                  "email": "johnsnow@email.com",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "Message 641998f45d6408b13cb229b0 added"
 *     }
 * 
 * @apiError CreateContactUsErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 */
const createContactUsMessage = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createContactUsSchema.validateAsync({ title: req.params.title, 
                                                                body: req.body.body, 
                                                                name: req.body.name, 
                                                                email: req.body.email });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const contactUs = new ContactUs({
        title: validatedData.title,
        body: validatedData.body,
        name: validatedData.name,
        email: validatedData.email
    });

    contactUs.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ success: `Message ${contactUs._id} added`, data: contactUs });
    });
}

/**
 * @apiGroup ContactUs
 * @apiPermission auth, admin
 * @api {delete} /api/v1/contact-us/:message 03. Delete Contact-Us Message (Permanently)
 * @apiName DeleteContactUsMessage
 * 
 * @apiParam {String} message Contact Us Message's ID.
 * 
 * @apiDescription This allows for permanent deletion of contact-us message record by admin.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 Deleted
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "title": "This is the title of the message",
 *                  "name": "John Snow",
 *                  "email": "johnsnow@email.com",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "Message 641998f45d6408b13cb229b0 has been permanently deleted"
 *     }
 * 
 * @apiError ContactUsMessageDeleteErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Parameter validation failed",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 404 ContactUsMessageNotFound
 *     {
 *       "message": "No message matches the contactUs 641998f45d6408b13cb229b0"
 *     }
 */
const deleteContactUsMessage = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getContactUsSchema.validateAsync({ message: req.params.message });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const contactUsMessageFound = await ContactUs.findOne({ _id: validatedData.message }).exec();
    if (!contactUsMessageFound) {
        return res.status(404).json({ message: `No message matches the vehicle ${validatedData.message}` });
    }

    const deletedContactUsMessage = await contactUsMessageFound.deleteOne();

    res.status(200).json({ success: `Message ${deletedContactUsMessage._id} has been permanently deleted`, data: `${deletedContactUsMessage}` })
}


module.exports = {
    getAllContactUsMessages, 
    createContactUsMessage, 
    deleteContactUsMessage
}