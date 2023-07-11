const UserLocation = require('../models/UserLocation');
const User = require('../models/User');
const getUserLocationSchema = require('../requestValidators/locations/getUserLocationValidator');
const createUserLocationSchema = require('../requestValidators/locations/createUserLocationValidator');
const getUserSchema = require('../requestValidators/users/getUserValidator');


/**
 * @apiGroup UserLocations
 * @apiPermission auth, admin
 * @api {get} /api/v1/user-locations    00. Get All Users' Locations
 * @apiName GetUsersLocations
 * 
 * @apiDescription This retrieves all user locations pertaining.
 *
 * @apiSuccess {String} _id     User location ID.
 * @apiSuccess {String} address     User location address.
 * @apiSuccess {String} latitude    User location latitude.
 * @apiSuccess {String} longitude   User location longitude.
 * @apiSuccess {String} plus_code       The plus code of the location which a precise location marker as latitude and longitude.
 * @apiSuccess {String} created_at User location creation date/time.
 * @apiSuccess {String} updated_at User location update date/time.
 * @apiSuccess {String} deleted_at User location deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "address": "123 John Snow Street, New York",
 *                  "latitude": "123.45678",
 *                  "longitude": "123.45678",
 *                  "plus_code": "1AW12-GH",
 *                  "user": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no user location records found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No User locations found"
 *     }
 */
const getAllUsersLocations = async (req, res) => {
    const usersLocations = await UserLocation.find().sort('-created_at').lean();
    if (!usersLocations?.length) return res.status(404).json({ message: "No user locations found" });

    res.json({ data: usersLocations });
};

/**
 * @apiGroup UserLocations
 * @apiPermission auth, admin
 * @api {get} /api/v1/user-locations/users/:user    01. Get All User Locations
 * @apiName GetUserLocations
 * 
 * @apiParam {String} user User's ID.
 * 
 * @apiDescription This retrieves all locations pertaining to a user.
 *
 * @apiSuccess {String} _id     User location ID.
 * @apiSuccess {String} address     User location address.
 * @apiSuccess {String} latitude    User location latitude.
 * @apiSuccess {String} longitude   User location longitude.
 * @apiSuccess {String} plus_code       The plus code of the location which a precise location marker as latitude and longitude.
 * @apiSuccess {String} created_at User location creation date/time.
 * @apiSuccess {String} updated_at User location update date/time.
 * @apiSuccess {String} deleted_at User location deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "address": "123 John Snow Street, New York",
 *                  "latitude": "123.45678",
 *                  "longitude": "123.45678",
 *                  "plus_code": "1AW12-GH",
 *                  "user": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no user location records found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No User locations found"
 *     }
 */
const getAllCurrentUserLocations = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getUserSchema.validateAsync({ user: req.params.user })
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userLocations = await UserLocation.find({ user: validatedData.user }).sort('-created_at').lean();
    if (!userLocations?.length) return res.status(404).json({ message: "No user locations found" });

    res.json({ data: userLocations });
}

/**
 * @apiGroup UserLocations
 * @apiPermission auth
 * @api {get} /api/v1/user-locations/my-locations    02. Get All Currently Authenticated User's Locations
 * @apiName GetAuthUserLocations
 * 
 * @apiDescription This retrieves all currently authenticated user's locations.
 *
 * @apiSuccess {String} _id     User location ID.
 * @apiSuccess {String} address     User location address.
 * @apiSuccess {String} latitude    User location latitude.
 * @apiSuccess {String} longitude   User location longitude.
 * @apiSuccess {String} plus_code       The plus code of the location which a precise location marker as latitude and longitude.
 * @apiSuccess {String} created_at User location creation date/time.
 * @apiSuccess {String} updated_at User location update date/time.
 * @apiSuccess {String} deleted_at User location deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "address": "123 John Snow Street, New York",
 *                  "latitude": "123.45678",
 *                  "longitude": "123.45678",
 *                  "plus_code": "1AW12-GH",
 *                  "user": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no user location records found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No User locations found"
 *     }
 */
const getAllAuthUserLocations = async (req, res) => {

    const userLocations = await UserLocation.find({ user: req.user_id }).sort('-created_at').lean();
    if (!userLocations?.length) return res.status(404).json({ message: "No user locations found" });

    res.json({ data: userLocations });
}

// this API method is called intermittently by the physical user's device automatically
/**
 * @apiGroup UserLocations
 * @apiPermission auth
 * @api {put} /api/v1/user-locations/:user/:userLocation/add-update        03. Add/Update User Location Record
 * @apiName UpdateUserLocation
 * 
 * @apiParam {String} user User's ID.
 * 
 * @apiParam {String} userLocation       User Location's ID.
 * 
 * @apiDescription This updates an existing user location record.
 * 
 * @apiBody {String} [address]       The address.
 * @apiBody {String} [latitude]       The latitude.
 * @apiBody {String} [longitude]       The longitude.
 * @apiBody {String} [plus_code]       The plus_code.
 * @apiExample {json} Request Body:
 *     {
 *        "message": "Wow! You got a cool ride.",
 *     }
 *
 * @apiSuccess {String} address         User location address
 * @apiSuccess {String} latitude        User location latitude.
 * @apiSuccess {String} longitude       User location longitude.
 * @apiSuccess {String} plus_code       User location plus code.
 * @apiSuccess {String} user         User on focus.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 UserLocationUpdated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "address": "123 John Snow Street, New York",
 *                  "latitude": "123.45678",
 *                  "longitude": "123.45678",
 *                  "plus_code": "1AW12-GH",
 *                  "user": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "User location 641998f45d6408b13cb229b0 updated"
 *     }
 * 
 * @apiError UpdateUserLocationErrors Possible error messages.
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
const addUpdateUserLocation = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createUserLocationSchema.validateAsync({ address: req.body.address, 
                                                                    latitude: req.body.latitude, 
                                                                    longitude: req.body.longitude, 
                                                                    plus_code: req.body.plus_code });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const ifAuthenticatedUser = await User.findOne({ _id: req.user_id }).lean();

    if (ifAuthenticatedUser._id != req.user_id) {
        return res.status(403).json({ message: "You do not have permission to update user locations that do not belong to you" });

    } else if (ifAuthenticatedUser._id == req.user_id) {
        const userFound = await User.findOne({ _id: req.user_id }).exec();
        if (!userFound) return res.status(404).json({ message: "User not found" });

        const userLocationFound = await UserLocation.findOne({ user: userFound._id }).exec()

        const userLocation = new UserLocation({
            address: validatedData.address,
            latitude: validatedData.latitude,
            longitude: validatedData.longitude,
            plus_code: validatedData.plus_code,
            user: userLocationFound.user
        })

        userLocation.save((error) => {
            if (error) {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }
            res.status(200).json({ message: `User location added`})
        });
    };
};

/**
 * @apiGroup UserLocations
 * @apiPermission auth
 * @api {put} /api/v1/user-locations/:userLocation 04. Soft-Delete User Location
 * @apiName SoftDeleteUserLocation
 * 
 * @apiParam {String} userLocation       User Location's ID.
 * 
 * @apiDescription This soft-deletes user location record (user uses this to delete user location. They can never retrieve it again. But same deleted user location record can be retrieved by admin.).
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 UserLocationInactivated
 *     {
 *       "data": {
 *                  "user_location_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "User location 641998f45d6408b13cb229b0 inactivated / deleted"
 *     }
 * 
 * @apiError UserLocationSoftDeleteErrors Possible error messages.
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
 * 
 *     HTTP/1.1 404 UserLocationNotFound
 *     {
 *       "message": "UserLocation not found"
 *     }
 */
const softDeleteUserLocation = async (req, res) => {
    // Consider using this method for your delete instead of the "deleteUser" method below

    let validatedData;
    try {
        validatedData = await getUserLocationSchema.validateAsync({ userLocation: req.params.userLocation });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userLocationFound = await UserLocation.findOne({ _id: validatedData.userLocation }).exec();

    if (userLocationFound.user != req.user_id) {
        return res.status(403).json({ message: "You do not have permission to delete locations that do not belong to you that do not belong to you" });

    } else if (userLocationFound.user == req.user_id) {

        if (!userLocationFound) return res.status(404).json({ message: "User location not found" });

        if (userLocationFound.deleted_at == '') userLocationFound.deleted_at = new Date().toISOString();

        userLocationFound.save((error) => {
            if (error) {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }
            res.status(200).json({ success: `User location ${userLocationFound._id} inactivated / deleted`, data: {"user_location_id": `${userLocationFound._id}`} });
        });
    };
};

/**
 * @apiGroup UserLocations
 * @apiPermission auth, admin
 * @api {patch} /api/v1/user-locations/:userLocation 05. Re-activate Soft-Deleted User Location
 * @apiName ReactivateSoftDeletedUserLocation
 * 
 * @apiParam {String} userLocation       User Location's ID.
 * 
 * @apiDescription This allows soft-deleted user location record to be re-activated.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 UserLocationReactivated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "message": "This user is really new. I am about to return it to you in 20 minutes. Nice ride!",
 *                  "for_user": "641998f45d6408b13cb229b0",
 *                  "for_user_hire": "641998f45d6408b13cb229b0",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "UserLocation 641998f45d6408b13cb229b0 reactivated"
 *     }
 * 
 * @apiError UserLocationSoftDeleteErrors Possible error messages.
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
 *     HTTP/1.1 404 UserLocationNotFound
 *     {
 *       "message": "User location not found"
 *     }
 */
const reactivateSoftDeletedUserLocation = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getUserLocationSchema.validateAsync({ userLocation: req.params.userLocation });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userLocationFound = await UserLocation.findOne({ _id: validatedData.userLocation }).exec();
    if (!userLocationFound) return res.status(404).json({ message: "User location not found" });

    if (userLocationFound.deleted_at != '') userLocationFound.deleted_at = '';

    userLocationFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ success: `User location ${userLocationFound._id} reactivated` });
    });
};

/**
 * @apiGroup UserLocations
 * @apiPermission auth, admin
 * @api {delete} /api/v1/user-locations/:userLocation 06. This Permanently Deletes a UserLocation Record
 * @apiName DeleteUserLocation
 * 
 * @apiParam {String} userLocation       User Location's ID.
 * 
 * @apiDescription This allows for permanent deletion of user location record by admin.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 Deleted
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "message": "This user is really new. I am about to return it to you in 20 minutes. Nice ride!",
 *                  "for_user": "641998f45d6408b13cb229b0",
 *                  "for_user_hire": "641998f45d6408b13cb229b0",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "UserLocation 641998f45d6408b13cb229b0 has been permanently deleted"
 *     }
 * 
 * @apiError UserLocationDeleteErrors Possible error messages.
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
 *     HTTP/1.1 404 UserLocationNotFound
 *     {
 *       "message": "No user location matches the user location record 641998f45d6408b13cb229b0"
 *     }
 */
const deleteUserLocation = async (req, res) => {
    // Consider not implementing this route on the client side. Rather, it is strongly recommended to use the "softDeleteUser" method above. 

    let validatedData;
    try {
        validatedData = await getUserLocationSchema.validateAsync({ userLocation: req.params.userLocation })
    } catch (error) {
        return res.status(400).json({ message: "Parameter validation failed", details: `${error}` });
    }

    const userLocationFound = await User.findOne({ _id: validatedData.userLocation }).exec();
    if (!userLocationFound) {
        return res.status(404).json({ message: `No user matches the user ${validatedData.user}` });
    }

    const deletedUserLocation = await userLocationFound.deleteOne();

    res.status(200).json({ success: `User location ${deletedUserLocation._id} has been permanently deleted` })
};


module.exports = {
    getAllUsersLocations,
    getAllCurrentUserLocations, 
    getAllAuthUserLocations, 
    addUpdateUserLocation, 
    softDeleteUserLocation, 
    reactivateSoftDeletedUserLocation, 
    deleteUserLocation
}