const bcrypt = require('bcrypt');
const cloudinaryImageUpload = require('../config/imageUpload/cloudinary');
const User = require('../models/User');
const UserLocation = require('../models/UserLocation');
const Vehicle = require('../models/Vehicle');
const VehicleHire = require('../models/VehicleHire');
const VehicleLocation = require('../models/VehicleLocation');
const Payment = require('../models/Payment');
const Interaction = require('../models/Interaction');
const getUserSchema = require('../requestValidators/users/getUserValidator');
const createUserSchema = require('../requestValidators/users/createUserValidator');
const updateUserSchema = require('../requestValidators/users/updateUserValidator');
const searchSchema = require('../requestValidators/searchValidator');


/**
 * @apiGroup Users
 * @apiPermission auth, admin
 * @api {get} /api/v1/users 00. Get All Users
 * @apiName GetUsers
 * 
 * @apiDescription This retrieves all users.
 *
 * @apiSuccess {String} _id     User ID.
 * @apiSuccess {String} username    User username.
 * @apiSuccess {String} first_name      User first name.
 * @apiSuccess {String} other_names     User other name(s).
 * @apiSuccess {String} last_name       User last name.
 * @apiSuccess {Object} user_image_path     User image information.
 * @apiSuccess {String} user_image_path.public_id   User image (public id).
 * @apiSuccess {String} user_image_path.url     User image (url).
 * @apiSuccess {String} enterprise_name     User enterprise name.
 * @apiSuccess {String} email   User email.
 * @apiSuccess {String} phone   User phone.
 * @apiSuccess {String} id_type     User ID tyoe.
 * @apiSuccess {String} id_number   User ID number.
 * @apiSuccess {Object} user_identification_image_path      User ID information.
 * @apiSuccess {String} user_identification_image_path.public_id    User ID image (public id).
 * @apiSuccess {String} user_identification_image_path.url      User ID image (url).
 * @apiSuccess {String} date_of_birth       User date of birth.
 * @apiSuccess {String} address     User address.
 * @apiSuccess {String} roles   User roles.
 * @apiSuccess {Date} email_verified    User email verification date.
 * @apiSuccess {Boolean} active     User active/deletion status.
 * @apiSuccess {Boolean} verified       User verification status by admin.
 * @apiSuccess {Object} ratings     Ratings on user.
 * @apiSuccess {Object} comments    Comments on user.
 * @apiSuccess {String} created_by      Admin accounr responsible for registering user.
 * @apiSuccess {Boolean} online     User online status.
 * @apiSuccess {Boolean} show_online_status     Show/Hide User online status.
 * @apiSuccess {String} last_time_active    User last time online.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "username": "testuser1",
 *                  "first_name": "John",
 *                  "other_names": "Dwight",
 *                  "last_name": "Snow",
 *                  "user_image_path": {"public_id": "frends_user_images/qrcluilfzrfpzoofvyyc",
 *                                      "url": "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_user_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "enterprise_namel": "Enterprises and Enterprises",
 *                  "email": "johnsnow@email.com",
 *                  "phone": "+12345678",
 *                  "id_type": "international Passport",
 *                  "id_number": "ABC123DE4567",
 *                  "user_identification_image_path": {"public_id": "frends_user_images/qrcluilfzrfpzoofvyyc",
 *                                                     "url": "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_user_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "date_of_birth": "2023-07-01",
 *                  "address": "123 John Snow Street, New York",
 *                  "roles": {"level3", ...},
 *                  "email_verified": "true",
 *                  "active": "true",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "created_by": "641998f45d6408b13cb229b0",
 *                  "online": true,
 *                  "show_online_status": true,
 *                  "last_time_active": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no users found. Impossible as the authenticated user is already a user.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Users found"
 *     }
 */
const getAllUsers = async (req, res) => {
    const users = await User.find().select(['-password', '-created_at', '-updated_at']).sort('-created_at').lean();
    if (!users?.length) return res.status(404).json({ message: "No users found" });

    res.status(200).json({ data: users });
};

/**
 * @apiGroup Users
 * @apiPermission auth, admin
 * @api {get} /api/v1/users/search/:searchKey 01. Search (Find) Users
 * @apiName SearchUsers
 * 
 * @apiParam {String} searchKey User's search key (username, first_name, other_names, last_name, occupation or location).
 * 
 * @apiDescription This retrieves users based on the search key.
 *
 * @apiSuccess {String} _id User ID.
 * @apiSuccess {String} username User username.
 * @apiSuccess {String} first_name User first name.
 * @apiSuccess {String} other_names User other name(s).
 * @apiSuccess {String} last_name User last name.
 * @apiSuccess {Object} user_image_path User image information.
 * @apiSuccess {String} user_image_path.public_id User image (public id).
 * @apiSuccess {String} user_image_path.url User image (url).
 * @apiSuccess {String} enterprise_name User enterprise name.
 * @apiSuccess {String} email User email.
 * @apiSuccess {String} phone User phone.
 * @apiSuccess {String} id_type User ID tyoe.
 * @apiSuccess {String} id_number User ID number.
 * @apiSuccess {Object} user_identification_image_path User ID information.
 * @apiSuccess {String} user_identification_image_path.public_id User ID image (public id).
 * @apiSuccess {String} user_identification_image_path.url User ID image (url).
 * @apiSuccess {String} date_of_birth User date of birth.
 * @apiSuccess {String} address User address.
 * @apiSuccess {String} roles User roles.
 * @apiSuccess {Date} email_verified User email verification date.
 * @apiSuccess {Boolean} active User active/deletion status.
 * @apiSuccess {Boolean} verified User verification status by admin.
 * @apiSuccess {Object} ratings Ratings on user.
 * @apiSuccess {Object} comments Comments on user.
 * @apiSuccess {String} created_by Admin accounr responsible for registering user.
 * @apiSuccess {Boolean} online User online status.
 * @apiSuccess {Boolean} show_online_status Show/Hide User online status.
 * @apiSuccess {String} last_time_active User last time online.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "username": "testuser1",
 *                  "first_name": "John",
 *                  "other_names": "Dwight",
 *                  "last_name": "Snow",
 *                  "user_image_path": {"public_id": "frends_user_images/qrcluilfzrfpzoofvyyc",
 *                                      "url": "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_user_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "enterprise_namel": "Enterprises and Enterprises",
 *                  "email": "johnsnow@email.com",
 *                  "phone": "+12345678",
 *                  "id_type": "international Passport",
 *                  "id_number": "ABC123DE4567",
 *                  "user_identification_image_path": {"public_id": "frends_user_images/qrcluilfzrfpzoofvyyc",
 *                                                     "url": "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_user_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "date_of_birth": "2023-07-01",
 *                  "address": "123 John Snow Street, New York",
 *                  "roles": {"level3", ...},
 *                  "email_verified": "true",
 *                  "active": "true",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "created_by": "641998f45d6408b13cb229b0",
 *                  "online": true,
 *                  "show_online_status": true,
 *                  "last_time_active": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               },
 *               {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "username": "testuser1",
 *                  "first_name": "John",
 *                  "other_names": "Dwight",
 *                  "last_name": "Snow",
 *                  "user_image_path": {"public_id": "frends_user_images/qrcluilfzrfpzoofvyyc",
 *                                      "url": "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_user_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "enterprise_namel": "Enterprises and Enterprises",
 *                  "email": "johnsnow@email.com",
 *                  "phone": "+12345678",
 *                  "id_type": "international Passport",
 *                  "id_number": "ABC123DE4567",
 *                  "user_identification_image_path": {"public_id": "frends_user_images/qrcluilfzrfpzoofvyyc",
 *                                                     "url": "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_user_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "date_of_birth": "2023-07-01",
 *                  "address": "123 John Snow Street, New York",
 *                  "roles": {"level3", ...},
 *                  "email_verified": "true",
 *                  "active": "true",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "created_by": "641998f45d6408b13cb229b0",
 *                  "online": true,
 *                  "show_online_status": true,
 *                  "last_time_active": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no matching user(s) found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No User found"
 *     }
 */
const searchUsers = async (req, res) => {
    if (!req?.params?.search) return res.status(400).json({ message: "Search key required" });

    let validatedData;
    try {
        validatedData = await searchSchema.validateAsync({ search: req.params.search })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }

    const users = await User
        .find({$or: [{username: new RegExp(validatedData.search, 'i')}, {first_name: new RegExp(validatedData.search, 'i')}, {other_names: new RegExp(validatedData.search, 'i')}, {last_name: new RegExp(validatedData.search, 'i')}, {occupation: new RegExp(validatedData.search, 'i')}, {location: new RegExp(validatedData.search, 'i')}]}).select(['-password', '-email_verified', '-active', '-created_by', '-created_at', '-updated_at'])
        .where({ active: true })
        .lean();
    
    if (!users?.length) return res.status(404).json({ message: "No user found" });

    res.status(200).json({ data: users });
};

/**
 * @apiGroup Users
 * @apiPermission public
 * @api {get} /api/v1/users/:user 02. Get User
 * @apiName GetUser
 * 
 * @apiParam {String} user User's ID.
 * 
 * @apiDescription This retrieves user based on the :user parameter.
 *
 * @apiSuccess {String} _id User ID.
 * @apiSuccess {String} username User username.
 * @apiSuccess {String} first_name User first name.
 * @apiSuccess {String} other_names User other name(s).
 * @apiSuccess {String} last_name User last name.
 * @apiSuccess {Object} user_image_path User image information.
 * @apiSuccess {String} user_image_path.public_id User image (public id).
 * @apiSuccess {String} user_image_path.url User image (url).
 * @apiSuccess {String} enterprise_name User enterprise name.
 * @apiSuccess {String} email User email.
 * @apiSuccess {String} phone User phone.
 * @apiSuccess {String} id_type User ID tyoe.
 * @apiSuccess {String} id_number User ID number.
 * @apiSuccess {Object} user_identification_image_path User ID information.
 * @apiSuccess {String} user_identification_image_path.public_id User ID image (public id).
 * @apiSuccess {String} user_identification_image_path.url User ID image (url).
 * @apiSuccess {String} date_of_birth User date of birth.
 * @apiSuccess {String} address User address.
 * @apiSuccess {String} roles User roles.
 * @apiSuccess {Date} email_verified User email verification date.
 * @apiSuccess {Boolean} active User active/deletion status.
 * @apiSuccess {Boolean} verified User verification status by admin.
 * @apiSuccess {Object} ratings Ratings on user.
 * @apiSuccess {Object} comments Comments on user.
 * @apiSuccess {String} created_by Admin accounr responsible for registering user.
 * @apiSuccess {Boolean} online User online status.
 * @apiSuccess {Boolean} show_online_status Show/Hide User online status.
 * @apiSuccess {String} last_time_active User last time online.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "username": "testuser1",
 *                  "first_name": "John",
 *                  "other_names": "Dwight",
 *                  "last_name": "Snow",
 *                  "user_image_path": {"public_id": "frends_user_images/qrcluilfzrfpzoofvyyc",
 *                                      "url": "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_user_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "enterprise_namel": "Enterprises and Enterprises",
 *                  "email": "johnsnow@email.com",
 *                  "phone": "+12345678",
 *                  "id_type": "international Passport",
 *                  "id_number": "ABC123DE4567",
 *                  "user_identification_image_path": {"public_id": "frends_user_images/qrcluilfzrfpzoofvyyc",
 *                                                     "url": "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_user_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "date_of_birth": "2023-07-01",
 *                  "address": "123 John Snow Street, New York",
 *                  "roles": {"level3", ...},
 *                  "email_verified": "true",
 *                  "active": "true",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "created_by": "641998f45d6408b13cb229b0",
 *                  "online": true,
 *                  "show_online_status": true,
 *                  "last_time_active": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }
 *     }
 * 
 * @apiError NotFound Possible error message if no matching user found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No User matches user 641998f45d6408b13cb229b0"
 *     }
 */
const getUser = async (req, res) => {
    if (!req?.params?.user) return res.status(400).json({ message: "Username required" });

    let validatedData;
    try {
        validatedData = await getUserSchema.validateAsync({ user: req.params.user })
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }
    
    const userFound = await User
        .findOne({$or: [{username: new RegExp(validatedData.user, 'i')}, {first_name: new RegExp(validatedData.user, 'i')}, {other_names: new RegExp(validatedData.user, 'i')}, {last_name: new RegExp(validatedData.user, 'i')}]})
        .select(['-password', '-email_verified', '-active', '-created_by', '-created_at', '-updated_at'])
        .where({ active: true })
        .lean();
    if (!userFound) {
        return res.status(404).json({ message: `No user matches ${validatedData.user}` });
    }
    res.status(200).json({ data: userFound });
};

/**
 * @apiGroup Users
 * @apiPermission public
 * @api {get} /api/v1/users/:user/friends 03. Get User Friends
 * @apiName GetUserFriends
 * 
 * @apiParam {String} user User's ID.
 * 
 * @apiDescription This retrieves user based on the :user parameter.
 *
 * @apiSuccess {String} _id User ID.
 * @apiSuccess {String} username User username.
 * @apiSuccess {String} first_name User first name.
 * @apiSuccess {String} other_names User other name(s).
 * @apiSuccess {String} last_name User last name.
 * @apiSuccess {Object} user_image_path User image information.
 * @apiSuccess {String} user_image_path.public_id User image (public id).
 * @apiSuccess {String} user_image_path.url User image (url).
 * @apiSuccess {String} enterprise_name User enterprise name.
 * @apiSuccess {String} email User email.
 * @apiSuccess {String} phone User phone.
 * @apiSuccess {String} id_type User ID tyoe.
 * @apiSuccess {String} id_number User ID number.
 * @apiSuccess {Object} user_identification_image_path User ID information.
 * @apiSuccess {String} user_identification_image_path.public_id User ID image (public id).
 * @apiSuccess {String} user_identification_image_path.url User ID image (url).
 * @apiSuccess {String} date_of_birth User date of birth.
 * @apiSuccess {String} address User address.
 * @apiSuccess {String} roles User roles.
 * @apiSuccess {Date} email_verified User email verification date.
 * @apiSuccess {Boolean} active User active/deletion status.
 * @apiSuccess {Boolean} verified User verification status by admin.
 * @apiSuccess {Object} ratings Ratings on user.
 * @apiSuccess {Object} comments Comments on user.
 * @apiSuccess {String} created_by Admin accounr responsible for registering user.
 * @apiSuccess {Boolean} online User online status.
 * @apiSuccess {Boolean} show_online_status Show/Hide User online status.
 * @apiSuccess {String} last_time_active User last time online.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "username": "testuser1",
 *                  "first_name": "John",
 *                  "other_names": "Dwight",
 *                  "last_name": "Snow",
 *                  "user_image_path": {"public_id": "frends_user_images/qrcluilfzrfpzoofvyyc",
 *                                      "url": "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_user_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "enterprise_namel": "Enterprises and Enterprises",
 *                  "email": "johnsnow@email.com",
 *                  "phone": "+12345678",
 *                  "id_type": "international Passport",
 *                  "id_number": "ABC123DE4567",
 *                  "user_identification_image_path": {"public_id": "frends_user_images/qrcluilfzrfpzoofvyyc",
 *                                                     "url": "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_user_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "date_of_birth": "2023-07-01",
 *                  "address": "123 John Snow Street, New York",
 *                  "roles": {"level3", ...},
 *                  "email_verified": "true",
 *                  "active": "true",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "created_by": "641998f45d6408b13cb229b0",
 *                  "online": true,
 *                  "show_online_status": true,
 *                  "last_time_active": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               },
 *               {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "username": "testuser1",
 *                  "first_name": "John",
 *                  "other_names": "Dwight",
 *                  "last_name": "Snow",
 *                  "user_image_path": {"public_id": "frends_user_images/qrcluilfzrfpzoofvyyc",
 *                                      "url": "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_user_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "enterprise_namel": "Enterprises and Enterprises",
 *                  "email": "johnsnow@email.com",
 *                  "phone": "+12345678",
 *                  "id_type": "international Passport",
 *                  "id_number": "ABC123DE4567",
 *                  "user_identification_image_path": {"public_id": "frends_user_images/qrcluilfzrfpzoofvyyc",
 *                                                     "url": "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_user_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "date_of_birth": "2023-07-01",
 *                  "address": "123 John Snow Street, New York",
 *                  "roles": {"level3", ...},
 *                  "email_verified": "true",
 *                  "active": "true",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "created_by": "641998f45d6408b13cb229b0",
 *                  "online": true,
 *                  "show_online_status": true,
 *                  "last_time_active": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error messages if no matching user found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Parameter Validation failed"
 *     }
 * 
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed"
 *     }
 * 
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "User has no friends"
 *     }
 */
const getUserVehicles = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getUserSchema.validateAsync({ user: req.params.user })
    } catch (error) {
        return res.status(400).json({ message: "User search term validation failed", details: `${error}` });
    }
    
    const userFound = await User.findOne({ username: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User does not exist. Perhaps, you should search by their names or other identification markers to see if you could find the user you are looking for." });

    const vehicles = await Vehicle.find({ added_by: userFound._id }).sort('-created_at').lean();
    if (!vehicles?.length) return res.status(404).json({ message: "Found no vehicles belonging to user" });

    res.status(200).json({ data: vehicles });
}

/**
 * @apiGroup Users
 * @apiPermission auth, admin
 * @api {post} /api/v1/users 04. Create New User
 * @apiName CreateNewUser
 * 
 * @apiDescription This creates a new user.
 * 
 * @apiBody {String} username     Username of the user.
 * @apiBody {String} first_name       First name of the user.
 * @apiBody {String} other_names       Other names of the user.
 * @apiBody {String} last_name       Last name of the user.
 * @apiBody {String} enterprise_name       Name of enterprise.
 * @apiBody {String} email       Email of the user.
 * @apiBody {String} phone       Phone of the user.
 * @apiBody {String} id_type       Type of user ID.
 * @apiBody {String} id_number       ID Number of the user ID.
 * @apiBody {String} date_of_birth       Date of birth of the user.
 * @apiBody {String} address       Address of the user.
 * @apiBody {String} account_type       Account type of the user.
 * @apiBody {Boolean} verified       Location of the user.
 * @apiBody {Boolean} active       User status (active/inactive).
 * @apiBody {File} user_photo       User photo.
 * @apiBody {File} user_id_photo       User ID photo.
 * @apiExample {json} Request Body:
 *     {
 *       "username": "testinguser1",
 *       "first_name": "John",
 *       "other_names": "Dwight",
 *       "last_name": "Snow",
 *       "enterprise_name": "Snow Enterprise",
 *       "email": "johnsnow@email.com",
 *       "phone": "+123456789",
 *       "id_type": "International Passport",
 *       "id_number": "ABC123DE456",
 *       "date_of_birth": "2023-01-01",
 *       "address": "123 John Snow Street, New York",
 *       "account_type": "individual",
 *       "verified": true,
 *       "active": true,
 *       "user_photo": (image file),
 *       "user_id_photo": (image file)
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 UserCreated
 *     {
 *       "data": {
 *                  "user_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "User testusername1 created"
 *     }
 * 
 * @apiError CreateUserErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed"
 *     }
 * 
 *     HTTP/1.1 400 ValidationError
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 409 Conflict
 *     {
 *       "message": "Username testusername1 already exists"
 *     }
 * 
 *     HTTP/1.1 400 ImageUploadFailed
 *     {
 *       "message": "Image upload failed"
 *     }
 */
const createUser = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createUserSchema.validateAsync({ username: req.body.username,
                                                            first_name: req.body.first_name,
                                                            other_names: req.body.other_names,
                                                            last_name: req.body.last_name,
                                                            enterprise_name: req.body.enterprise_name,
                                                            email: req.body.email,
                                                            phone: req.body.phone,
                                                            id_type: req.body.id_type,
                                                            id_number: req.body.id_number, 
                                                            date_of_birth: req.body.date_of_birth, 
                                                            address: req.body.address,  
                                                            account_type: req.body.account_type, 
                                                            active: req.body.active, 
                                                            verified: req.body.verified });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const duplicateUsername = await User.findOne({ username: validatedData.username }).lean();
    const duplicateEmail = await User.findOne({ email: validatedData.email }).lean();

    if (duplicateUsername) {
        return res.status(409).json({ message: `Username ${duplicateUsername.username} already exists` });
    } else if (duplicateEmail) {
        return res.status(409).json({ message: `User email ${duplicateEmail.email} already exists` });
    }

    const userImage = req.files.user_photo;
    const userIdImage = req.files.user_id_photo;

    const userImageUpload = await cloudinaryImageUpload(userImage.tempFilePath, "rent_a_ride_user_images");
    if (!userImageUpload) return res.status(400).json({ message: "Image upload failed" });

    const userIdImageUpload = await cloudinaryImageUpload(userIdImage, "rent_a_ride_user_identification_images");
    if (!userIdImageUpload) return res.status(400).json({ message: "Image upload failed" });

    let accountType;

    if (!validatedData.type) {
        accountType = "level1";
    } else if (validatedData.type && validatedData.type == "individual") {
        accountType = "level1";
    } else if (validatedData.type && validatedData.type == "vendor") {
        accountType = "level2";
    } else if (validatedData.type && validatedData.type == "admin") {
        accountType = "level3";
    }

    const user = new User({
        username: validatedData.username,
        password: validatedData.password,
        first_name: validatedData.first_name,
        other_names: validatedData.other_names,
        last_name: validatedData.last_name,
        enterprise_name: validatedData.enterprise_name,
        email: validatedData.email,
        id_type: validatedData.id_type,
        id_number: validatedData.id_number,
        address: validatedData.address,
        date_of_birth: validatedData.date_of_birth,
        role: accountType,
        active: validatedData.active,
        user_picture_path: {
            public_id: userImageUpload.public_id,
            url: userImageUpload.secure_url
        },
        user_identification_image_path: {
            public_id: userIdImageUpload.public_id,
            url: userIdImageUpload.secure_url
        },
        verified: validatedData.verified,
        created_by: validatedData.validUser
    });

    user.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ data: {"user_id": `${user._id}`}, success: `User ${user.username} created` });
    });
};

/**
 * @apiGroup Users
 * @apiPermission auth
 * @api {patch} /api/v1/users/:user 05. Update User
 * @apiName UpdateUser
 * 
 * @apiParam {String} user User's ID.
 * 
 * @apiDescription This updates an existing user.
 * 
 * @apiBody {String} [username]     Username of the user.
 * @apiBody {String} [first_name]       First name of the user.
 * @apiBody {String} [other_names]       Other names of the user.
 * @apiBody {String} [last_name]       Last name of the user.
 * @apiBody {String} [enterprise_name]       Name of enterprise.
 * @apiBody {String} [email]       Email of the user.
 * @apiBody {String} [phone]       Phone of the user.
 * @apiBody {String} [id_type]       Type of user ID.
 * @apiBody {String} [id_number]       ID Number of the user ID.
 * @apiBody {String} [date_of_birth]       Date of birth of the user.
 * @apiBody {String} [address]       Address of the user.
 * @apiBody {String} [account_type]       Account type of the user.
 * @apiBody {Boolean} [verified]       Location of the user.
 * @apiBody {Boolean} [active]       User status (active/inactive).
 * @apiBody {File} [user_photo]       User photo.
 * @apiBody {File} [user_id_photo]       User ID photo.
 * @apiExample {json} Request Body:
 *     {
 *       "username": "testinguser1",
 *       "first_name": "John",
 *       "other_names": "Dwight",
 *       "last_name": "Snow",
 *       "enterprise_name": "Snow Enterprise",
 *       "email": "johnsnow@email.com",
 *       "phone": "+123456789",
 *       "id_type": "International Passport",
 *       "id_number": "ABC123DE456",
 *       "date_of_birth": "2023-01-01",
 *       "address": "123 John Snow Street, New York",
 *       "account_type": "individual",
 *       "verified": true,
 *       "active": true,
 *       "user_photo": (image file),
 *       "user_id_photo": (image file)
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 UserUpdated
 *     {
 *       "data": {
 *                  "user_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "User testusername1 updated"
 *     }
 * 
 * @apiError UserUpdateErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed"
 *     }
 * 
 *     HTTP/1.1 400 ValidationError
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 *  
 *     HTTP/1.1 400 ImageUploadFailed
 *     {
 *       "message": "Image upload failed"
 *     }
 * 
 *     HTTP/1.1 403 Unauthorized
 *     {
 *       "message": "You do not have permission to update user details"
 *     }
 * 
 *     HTTP/1.1 404 UserNotFound
 *     {
 *       "message": "User not found"
 *     }
 * 
 *     HTTP/1.1 409 Conflict
 *     {
 *       "message": "Username testusername1 already exists"
 *     }
 */
const updateUser = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updateUserSchema.validateAsync({ user: req.params.user,
                                                            username: req.body.username,
                                                            first_name: req.body.first_name,
                                                            other_names: req.body.other_names,
                                                            last_name: req.body.last_name,
                                                            enterprise_name: req.body.enterprise_name,
                                                            email: req.body.email,
                                                            phone: req.body.phone,
                                                            id_type: req.body.id_type,
                                                            id_number: req.body.id_number, 
                                                            date_of_birth: req.body.date_of_birth, 
                                                            address: req.body.address,  
                                                            account_type: req.body.account_type });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ _id: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User not found" });

    const userImage = req.files.user_photo;
    const userIdImage = req.files.user_id_photo;

    const userImageUpload = await cloudinaryImageUpload(userImage.tempFilePath, "rent_a_ride_user_images");
    if (!userImageUpload) return res.status(409).json({ message: "Image upload failed" });

    const userIdImageUpload = await cloudinaryImageUpload(userIdImage, "rent_a_ride_user_identification_images");
    if (!userIdImageUpload) return res.status(409).json({ message: "Image upload failed" });

    let accountType;

    if (!validatedData.type) {
        accountType = "level1";
    } else if (validatedData.type && validatedData.type == "individual") {
        accountType = "level1";
    } else if (validatedData.type && validatedData.type == "vendor") {
        accountType = "level2";
    }

    if (validatedData.username) userFound.username = validatedData.username;
    if (validatedData.first_name) userFound.first_name = validatedData.first_name;
    if (validatedData.other_names) userFound.other_names = validatedData.other_names;
    if (validatedData.last_name) userFound.last_name = validatedData.last_name;
    if (validatedData.enterprise_name) userFound.enterprise_name = validatedData.enterprise_name;
    if (validatedData.email) userFound.email = validatedData.email;
    if (validatedData.id_type) userFound.id_type = validatedData.id_type;
    if (validatedData.id_number) userFound.id_number = validatedData.id_number; 
    if (validatedData.date_of_birth) userFound.date_of_birth = date_of_birth; 
    if (validatedData.address) userFound.address = address; 
    if (validatedData.type) userFound.role = accountType;
    if (userImageUpload) {
        userFound.user_image_path.public_id = userImageUpload.public_id;
        userFound.user_image_path.url = userImageUpload.secure_url;
    }
    if (userIdImageUpload) {
        userFound.user_identification_image_path.public_id = userIdImageUpload.public_id;
        userFound.user_identification_image_path.url = userIdImageUpload.secure_url;
    }

    userFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ 
                                data: {
                                        "user_id": `${userFound._id}` 
                                    }, 
                                success: `User ${userFound.username} updated` 
                            });
    });
};

/**
 * @apiGroup Users
 * @apiPermission auth, admin
 * @api {put} /api/v1/users/:user 06. Update User (Admin Access)
 * @apiName UpdateUserAdminAccess
 * 
 * @apiParam {String} user User's ID.
 * 
 * @apiDescription This updates an existing user.
 * 
 * @apiBody {String} [username]     Username of the user.
 * @apiBody {String} [first_name]       First name of the user.
 * @apiBody {String} [other_names]       Other names of the user.
 * @apiBody {String} [last_name]       Last name of the user.
 * @apiBody {String} [enterprise_name]       Name of enterprise.
 * @apiBody {String} [email]       Email of the user.
 * @apiBody {String} [phone]       Phone of the user.
 * @apiBody {String} [id_type]       Type of user ID.
 * @apiBody {String} [id_number]       ID Number of the user ID.
 * @apiBody {String} [date_of_birth]       Date of birth of the user.
 * @apiBody {String} [address]       Address of the user.
 * @apiBody {String} [account_type]       Account type of the user.
 * @apiBody {Boolean} [verified]       Location of the user.
 * @apiBody {Boolean} [active]       User status (active/inactive).
 * @apiBody {File} [user_photo]       User photo.
 * @apiBody {File} [user_id_photo]       User ID photo.
 * @apiExample {json} Request Body:
 *     {
 *       "username": "testinguser1",
 *       "first_name": "John",
 *       "other_names": "Dwight",
 *       "last_name": "Snow",
 *       "enterprise_name": "Snow Enterprise",
 *       "email": "johnsnow@email.com",
 *       "phone": "+123456789",
 *       "id_type": "International Passport",
 *       "id_number": "ABC123DE456",
 *       "date_of_birth": "2023-01-01",
 *       "address": "123 John Snow Street, New York",
 *       "account_type": "individual",
 *       "verified": true,
 *       "active": true,
 *       "user_photo": (image file),
 *       "user_id_photo": (image file)
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 UserUpdated
 *     {
 *       "data": {
 *                  "user_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "User testusername1 updated"
 *     }
 * 
 * @apiError UserUpdateErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed"
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 *  
 *     HTTP/1.1 400 ImageUploadFailed
 *     {
 *       "message": "Image upload failed"
 *     }
 * 
 *     HTTP/1.1 403 Unauthorized
 *     {
 *       "message": "You do not have permission to update user details"
 *     }
 * 
 *     HTTP/1.1 404 UserNotFound
 *     {
 *       "message": "User not found"
 *     }
 * 
 *     HTTP/1.1 409 Conflict
 *     {
 *       "message": "Username testusername1 already exists"
 *     }
 */
const updateUserAdminLevel = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updateUserSchema.validateAsync({ user: req.params.user, 
                                                            username: req.body.username,
                                                            first_name: req.body.first_name,
                                                            other_names: req.body.other_names,
                                                            last_name: req.body.last_name,
                                                            enterprise_name: req.body.enterprise_name,
                                                            email: req.body.email,
                                                            phone: req.body.phone,
                                                            id_type: req.body.id_type,
                                                            id_number: req.body.id_number, 
                                                            date_of_birth: req.body.date_of_birth, 
                                                            address: req.body.address,  
                                                            account_type: req.body.account_type, 
                                                            active: req.body.active, 
                                                            verified: req.body.verified });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ username: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User not found" });

    const userImage = req.files.user_photo;
    const userIdImage = req.files.user_id_photo;

    const userImageUpload = await cloudinaryImageUpload(userImage.tempFilePath, "rent_a_ride_user_images");
    if (!userImageUpload) return res.status(409).json({ message: "Image upload failed" });

    const userIdImageUpload = await cloudinaryImageUpload(userIdImage, "rent_a_ride_user_identification_images");
    if (!userIdImageUpload) return res.status(409).json({ message: "Image upload failed" });

    let accountType;

    if (!validatedData.type) {
        accountType = "level1";
    } else if (validatedData.type && validatedData.type == "individual") {
        accountType = "level1";
    } else if (validatedData.type && validatedData.type == "enterprise") {
        accountType = "level2";
    } else if (validatedData.type && validatedData.type == "admin") {
        accountType = "level3";
    }

    if (validatedData.username) userFound.username = validatedData.username;
    if (validatedData.first_name) userFound.first_name = validatedData.first_name;
    if (validatedData.other_names) userFound.other_names = validatedData.other_names;
    if (validatedData.last_name) userFound.last_name = validatedData.last_name;
    if (validatedData.enterprise_name) userFound.enterprise_name = validatedData.enterprise_name;
    if (validatedData.email) userFound.email = validatedData.email;
    if (validatedData.id_type) userFound.id_type = validatedData.id_type;
    if (validatedData.id_number) userFound.id_number = validatedData.id_number;
    if (validatedData.date_of_birth) userFound.date_of_birth = date_of_birth;
    if (validatedData.address) userFound.address = address;
    if (validatedData.type) userFound.roles = accountType;
    if (userImageUpload) {
        userFound.user_image_path.public_id = userImageUpload.public_id;
        userFound.user_image_path.url = userImageUpload.secure_url;
    }
    if (userIdImageUpload) {
        userFound.user_identification_image_path.public_id = userIdImageUpload.public_id;
        userFound.user_identification_image_path.url = userIdImageUpload.secure_url;
    }
    if (validatedData.active) userFound.active = active;
    if (validatedData.verified) userFound.verified = verified;

    userFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ 
                                data: {
                                        "user_id": `${userFound._id}` 
                                    }, 
                                success: `User ${userFound.username} updated` 
                            });
    });
};

/**
 * @apiGroup Users
 * @apiPermission auth
 * @api {patch} /api/v1/users/:user/delete 07. Soft-Delete User (User Deactivates Self-Account)
 * @apiName SoftDeleteUser
 * 
 * @apiParam {String} user User's ID.
 * 
 * @apiDescription This allows user to de-activate account (delete self).
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 UserInactivated
 *     {
 *       "data": {
 *                  "user_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "User testusername1 inactivated / deleted"
 *     }
 * 
 * @apiError UserSoftDeleteErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed"
 *     }
 * 
 *     HTTP/1.1 400 ValidationError
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 403 Unauthorized
 *     {
 *       "message": "You do not have the required permission to execute this action"
 *     }
 * 
 *     HTTP/1.1 404 UserNotFound
 *     {
 *       "message": "User not found"
 *     }
 */
const softDeleteUser = async (req, res) => {
    // Consider using this method for your delete instead of the "deleteUser" method below

    let validatedData;
    try {
        validatedData = await getUserSchema.validateAsync({ user: req.body.user });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ _id: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User not found" });

    if (userFound.active == true) {
        userFound.active = false;
        userFound.deleted_at = new Date().toISOString();
    }

    userFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ 
                                data: {"user_id": `${userFound._id}`}, 
                                success: `User ${userFound.username} inactivated / deleted` 
                            });
    });
}

/**
 * @apiGroup Users
 * @apiPermission auth, admin
 * @api {patch} /api/v1/users/:user/re-activate 08. Re-activate Soft-Deleted User
 * @apiName ReactivateSoftDeletedUser
 * 
 * @apiParam {String} user User's ID.
 * 
 * @apiDescription This allows soft-deleted user account to be re-activated.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 UserReactivated
 *     {
 *       "data": {
 *                  "user_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "User testusername1 reactivated"
 *     }
 * 
 * @apiError UserSoftDeleteErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed"
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 404 UserNotFound
 *     {
 *       "message": "User not found"
 *     }
 */
const reactivateSoftDeletedUser = async (req, res) => {

    let validatedData;
    try {
        validatedData = await reactivateSoftDeletedUserSchema.validateAsync({ username: req.body.username });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ username: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User not found" });

    if (userFound.active == false) {
        userFound.active = true; 
        userFound.deleted_at = ''; 
    }

    userFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ 
                                data: {"user_id": `${userFound._id}`}, 
                                success: `User ${userFound.username} reactivated` 
                            });
    });
}

/**
 * @apiGroup Users
 * @apiPermission auth, admin
 * @api {delete} /api/v1/users/:user 09. Delete User (Permanently)
 * @apiName DeleteUser
 * 
 * @apiParam {String} user User's ID.
 * 
 * @apiDescription This allows for permanent deletion of user account and their posts by admin.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 Deleted
 *     {
 *       "data": {
 *                  "user_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "User testusername1 and all records belonging to user have been permanently deleted"
 *     }
 * 
 * @apiError UserDeleteErrors Possible error messages.
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
 *     HTTP/1.1 404 UserNotFound
 *     {
 *       "message": "No user matches the user 641998f45d6408b13cb229b0"
 *     }
 */
const deleteUser = async (req, res) => {
    // Consider not implementing this route on the client side, as other important/sensitive data like the payment information and vehicles could be affected. Rather, it is strongly recommended to use the "softDeleteUser" method above. 

    let validatedData;
    try {
        validatedData = await getUserSchema.validateAsync({ user: req.params.user })
    } catch (error) {
        return res.status(400).json({ message: "User search term validation failed", details: `${error}` });
    }

    const user = await User.findOne({ _id: validatedData.user }).exec();
    if (!user) {
        return res.status(404).json({ message: `No user matches the user ${validatedData.user}` });
    }

    const ifAuthenticatedUser = await User.findOne({ _id: req.user_id }).lean();

    if (ifAuthenticatedUser._id == req.user_id) {
        return res.status(403).json({ message: "You cannot delete yourself D:" });

    } else if (ifAuthenticatedUser._id != req.user_id) {

        // Find and delete all other information relating to user; then, the user
        const userLocations = await UserLocation.find({ user: validatedData.user }).exec();
        // const payments = await Payment.find({ user: validatedData.user }).exec();
        const vehicles = await Vehicle.find({ user: validatedData.user }).exec();
        const vehicleHires = await VehicleHire.find({ user: validatedData.user }).exec();
        const vehicleLocations = await VehicleLocation.find({ vehicle: vehicles._id }).exec();
        const interactions = await Interaction.find({ for_user: validatedData.user }).exec();

        if (userLocations) {
            await userLocations.deleteMany();
        }

        // if (payments) {
        //     await payments.deleteMany();
        // }

        if (vehicles) {
            await vehicles.deleteMany();
        }

        if (vehicleHires) {
            await vehicleHires.deleteMany();
        }

        if (userLocations) {
            await userLocations.deleteMany();
        }

        if (interactions) {
            await interactions.deleteMany();
        }

        const deletedUser = await user.deleteOne();

        res.status(200).json({ 
                                data: {"user_id": `${deletedUser._id}`}, 
                                success: `User ${deletedUser.username} and all records belonging to user have been permanently deleted` })
    };
};


module.exports = {
    getAllUsers,
    searchUsers,
    getUser, 
    getUserVehicles,
    createUser,
    updateUser,
    updateUserAdminLevel,
    softDeleteUser,
    reactivateSoftDeletedUser,
    deleteUser
}