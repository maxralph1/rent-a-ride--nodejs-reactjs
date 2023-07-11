const VehicleLocation = require('../models/VehicleLocation');
const Vehicle = require('../models/Vehicle');
const getVehicleLocationSchema = require('../requestValidators/locations/getVehicleLocationValidator')
const createVehicleLocationSchema = require('../requestValidators/locations/createVehicleLocationValidator');
const getVehicleSchema = require('../requestValidators/vehicles/getVehicleValidator');
const getUserSchema = require('../requestValidators/users/getUserValidator');


/**
 * @apiGroup VehicleLocations
 * @apiPermission auth, admin
 * @api {get} /api/v1/vehicle-locations    00. Get All Vehicle Locations
 * @apiName GetVehicleLocations
 * 
 * @apiDescription This retrieves all vehicle locations pertaining.
 *
 * @apiSuccess {String} _id     Vehicle location ID.
 * @apiSuccess {String} address     Vehicle location address.
 * @apiSuccess {String} latitude    Vehicle location latitude.
 * @apiSuccess {String} longitude   Vehicle location longitude.
 * @apiSuccess {String} plus_code       The plus code of the location which a precise location marker as latitude and longitude.
 * @apiSuccess {String} created_at Vehicle location creation date/time.
 * @apiSuccess {String} updated_at Vehicle location update date/time.
 * @apiSuccess {String} deleted_at Vehicle location deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "address": "123 John Snow Street, New York",
 *                  "latitude": "123.45678",
 *                  "longitude": "123.45678",
 *                  "plus_code": "1AW12-GH",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no vehicle location records found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Vehicle locations found"
 *     }
 */
const getAllVehiclesLocations = async (req, res) => {
    const vehiclesLocations = await VehicleLocation.find().sort('-created_at').lean();
    if (!vehiclesLocations?.length) return res.status(404).json({ message: "No vehicle locations found" });

    res.json({ data: vehiclesLocations });
};

/**
 * @apiGroup VehicleLocations
 * @apiPermission auth, admin
 * @api {get} /api/v1/vehicle-locations/users/:user    01. Get All User Vehicle Locations
 * @apiName GetUserVehicleLocations
 * 
 * @apiParam {String} user User's ID.
 * 
 * @apiDescription This retrieves all vehicle locations pertaining to a user.
 *
 * @apiSuccess {String} _id     Vehicle location ID.
 * @apiSuccess {String} address     Vehicle location address.
 * @apiSuccess {String} latitude    Vehicle location latitude.
 * @apiSuccess {String} longitude   Vehicle location longitude.
 * @apiSuccess {String} plus_code       The plus code of the location which a precise location marker as latitude and longitude.
 * @apiSuccess {String} created_at Vehicle location creation date/time.
 * @apiSuccess {String} updated_at Vehicle location update date/time.
 * @apiSuccess {String} deleted_at Vehicle location deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "address": "123 John Snow Street, New York",
 *                  "latitude": "123.45678",
 *                  "longitude": "123.45678",
 *                  "plus_code": "1AW12-GH",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no vehicle location records found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Vehicle locations found"
 *     }
 */
const getAllUserVehiclesLocations = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getUserSchema.validateAsync({ user: req.params.user })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ _id: validatedData.user }).lean();
    const vehicleFound = await Vehicle.findOne({ user: userFound._id }).lean();

    const vehicleLocations = await VehicleLocation.find({ user: vehicleFound.vehicle }).sort('-created_at').lean();
    if (!vehicleLocations?.length) return res.status(404).json({ message: "No vehicle locations found" });

    res.json({ data: vehicleLocations });
};

/**
 * @apiGroup VehicleLocations
 * @apiPermission auth
 * @api {get} /api/v1/vehicle-locations/auth    02. Get All Currently Authenticated User's Vehicle Locations
 * @apiName GetAuthUserVehicleLocations
 * 
 * @apiDescription This retrieves all currently authenticated user's vehicle locations.
 *
 * @apiSuccess {String} _id     Vehicle location ID.
 * @apiSuccess {String} address     Vehicle location address.
 * @apiSuccess {String} latitude    Vehicle location latitude.
 * @apiSuccess {String} longitude   Vehicle location longitude.
 * @apiSuccess {String} plus_code       The plus code of the location which a precise location marker as latitude and longitude.
 * @apiSuccess {String} created_at Vehicle location creation date/time.
 * @apiSuccess {String} updated_at Vehicle location update date/time.
 * @apiSuccess {String} deleted_at Vehicle location deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "address": "123 John Snow Street, New York",
 *                  "latitude": "123.45678",
 *                  "longitude": "123.45678",
 *                  "plus_code": "1AW12-GH",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no vehicle location records found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Vehicle locations found"
 *     }
 */
const getAllAuthUserVehiclesLocations = async (req, res) => {
    const userFound = await User.findOne({ _id: req.user_id }).lean();
    const vehicleFound = await Vehicle.findOne({ user: userFound._id }).lean();

    const vehicleLocations = await VehicleLocation.find({ user: vehicleFound.vehicle }).sort('-created_at').lean();
    if (!vehicleLocations?.length) return res.status(404).json({ message: "No vehicle locations found" });

    res.json({ data: vehicleLocations });
}

/**
 * @apiGroup VehicleLocations
 * @apiPermission auth, admin
 * @api {get} /api/v1/vehicle-locations/vehicles/:vehicle    03. Get All Specific Vehicle Locations
 * @apiName GetSpecificVehicleLocations
 * 
 * @apiParam {String} vehicle Vehicle's ID.
 * 
 * @apiDescription This retrieves all locations pertaining to a specific vehicle.
 *
 * @apiSuccess {String} _id     Vehicle location ID.
 * @apiSuccess {String} address     Vehicle location address.
 * @apiSuccess {String} latitude    Vehicle location latitude.
 * @apiSuccess {String} longitude   Vehicle location longitude.
 * @apiSuccess {String} plus_code       The plus code of the location which a precise location marker as latitude and longitude.
 * @apiSuccess {String} created_at Vehicle location creation date/time.
 * @apiSuccess {String} updated_at Vehicle location update date/time.
 * @apiSuccess {String} deleted_at Vehicle location deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "address": "123 John Snow Street, New York",
 *                  "latitude": "123.45678",
 *                  "longitude": "123.45678",
 *                  "plus_code": "1AW12-GH",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no vehicle location records found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Vehicle locations found"
 *     }
 */
const getAllCurrentVehicleLocations = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getVehicleSchema.validateAsync({ vehicle: req.params.vehicle })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }

    const vehicleLocations = await VehicleLocation.find({ vehicle: validatedData.vehicle }).sort('-created_at').lean();
    if (!vehicleLocations?.length) return res.status(404).json({ message: "No vehicle locations found" });

    res.json({ data: vehicleLocations });
};

// this API method is called intermittently by the physical vehicle itself using a tracking device
/**
 * @apiGroup VehicleLocations
 * @apiPermission auth
 * @api {put} /api/v1/vehicle-locations/:vehicle/:vehicleLocation/add-update        04. Add/Update Vehicle Location Record
 * @apiName UpdateVehicleLocation
 * 
 * @apiParam {String} vehicle Vehicle's ID.
 * 
 * @apiParam {String} vehicleLocation       Vehicle Location's ID.
 * 
 * @apiDescription This updates an existing vehicle location record.
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
 * @apiSuccess {String} address         Vehicle location address
 * @apiSuccess {String} latitude        Vehicle location latitude.
 * @apiSuccess {String} longitude       Vehicle location longitude.
 * @apiSuccess {String} plus_code       Vehicle location plus code.
 * @apiSuccess {String} vehicle         Vehicle on focus.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 VehicleLocationUpdated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "address": "123 John Snow Street, New York",
 *                  "latitude": "123.45678",
 *                  "longitude": "123.45678",
 *                  "plus_code": "1AW12-GH",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "Vehicle location 641998f45d6408b13cb229b0 updated"
 *     }
 * 
 * @apiError UpdateVehicleLocationErrors Possible error messages.
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
const addUpdateVehicleLocation = async (req, res) => {
    
    let validatedData;
    try {
        validatedData = await createVehicleLocationSchema.validateAsync({ vehicle: req.params.vehicle, 
                                                                        vehicleLocation: req.params.vehicle-location, 
                                                                        address: req.body.address, 
                                                                        latitude: req.body.latitude, 
                                                                        longitude: req.body.longitude, 
                                                                        plus_code: req.body.plus_code, 
                                                                        vehicle: req.body.vehicle });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleFound = await Vehicle.findOne({ _id: validatedData.vehicle }).exec();
    if (!vehicleFound) return res.status(404).json({ message: "Vehicle not found" });

    const vehicleLocationFound = await VehicleLocation.findOne({ vehicle: vehicleFound._id }).exec()


    if (!vehicleLocationFound) {
        const vehicleLocation = new VehicleLocation({
            address: validatedData.address,
            latitude: validatedData.latitude,
            longitude: validatedData.longitude,
            plus_code: validatedData.plus_code,
            vehicle: vehicleLocationFound.vehicle
        })

        vehicleLocation.save((error) => {
            if (error) {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }
            res.status(200).json({ message: `Vehicle location added`})
        })

    } else if (vehicleLocationFound) {
        if (validatedData.address) vehicleLocationFound.address = validatedData.address;
        if (validatedData.latitude) vehicleLocationFound.latitude = validatedData.latitude;
        if (validatedData.longitude) vehicleLocationFound.longitude = validatedData.longitude;
        if (validatedData.plus_code) vehicleLocationFound.plus_code = validatedData.plus_code;

        vehicleLocationFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ success: `Vehicle location ${vehicleLocationFound._id} updated`, data: `${vehicleLocationFound}` });
    });
    }
};

/**
 * @apiGroup VehicleLocations
 * @apiPermission auth
 * @api {put} /api/v1/vehicle-locations/:vehicleLocation 05. Soft-Delete Vehicle Location
 * @apiName SoftDeleteVehicleLocation
 * 
 * @apiParam {String} vehicleLocation       Vehicle Location's ID.
 * 
 * @apiDescription This soft-deletes vehicle location record (user uses this to delete vehicle location. They can never retrieve it again. But same deleted vehicle location record can be retrieved by admin.).
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 VehicleLocationInactivated
 *     {
 *       "data": {
 *                  "vehicle_location_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "Vehicle location 641998f45d6408b13cb229b0 inactivated / deleted"
 *     }
 * 
 * @apiError VehicleLocationSoftDeleteErrors Possible error messages.
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
 *     HTTP/1.1 404 VehicleLocationNotFound
 *     {
 *       "message": "VehicleLocation not found"
 *     }
 */
const softDeleteVehicleLocation = async (req, res) => {
    // Consider using this method for your delete instead of the "deleteVehicle" method below

    let validatedData;
    try {
        validatedData = await getVehicleLocationSchema.validateAsync({ vehicleLocation: req.params.vehicleLocation });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleLocationFound = await VehicleLocation.findOne({ _id: validatedData.vehicleLocation }).exec();
    if (!vehicleLocationFound) return res.status(404).json({ message: "Vehicle location not found" });

    if (vehicleLocationFound.deleted_at == '') vehicleLocationFound.deleted_at = new Date().toISOString();

    vehicleLocationFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ success: `Vehicle location ${vehicleLocationFound._id} inactivated / deleted`, data: {"vehicle_location_id": `${vehicleLocationFound._id}`} });
    });
};

/**
 * @apiGroup VehicleLocations
 * @apiPermission auth, admin
 * @api {patch} /api/v1/vehicle-locations/:vehicleLocation 06. Re-activate Soft-Deleted Vehicle Location
 * @apiName ReactivateSoftDeletedVehicleLocation
 * 
 * @apiParam {String} vehicleLocation       Vehicle Location's ID.
 * 
 * @apiDescription This allows soft-deleted vehicle location record to be re-activated.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 VehicleLocationReactivated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "message": "This vehicle is really new. I am about to return it to you in 20 minutes. Nice ride!",
 *                  "for_vehicle": "641998f45d6408b13cb229b0",
 *                  "for_vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "VehicleLocation 641998f45d6408b13cb229b0 reactivated"
 *     }
 * 
 * @apiError VehicleLocationSoftDeleteErrors Possible error messages.
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
 *     HTTP/1.1 404 VehicleLocationNotFound
 *     {
 *       "message": "Vehicle location not found"
 *     }
 */
const reactivateSoftDeletedVehicleLocation = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getVehicleLocationSchema.validateAsync({ vehicleLocation: req.params.vehicleLocation });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleLocationFound = await VehicleLocation.findOne({ _id: validatedData.vehicleLocation }).exec();
    if (!vehicleLocationFound) return res.status(404).json({ message: "Vehicle location not found" });

    if (vehicleLocationFound.deleted_at != '') vehicleLocationFound.deleted_at = '';

    vehicleLocationFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ success: `Vehicle location ${vehicleLocationFound._id} reactivated` });
    });
};

/**
 * @apiGroup VehicleLocations
 * @apiPermission auth, admin
 * @api {delete} /api/v1/vehicle-locations/:vehicleLocation 07. This Permanently Deletes a VehicleLocation Record
 * @apiName DeleteVehicleLocation
 * 
 * @apiParam {String} vehicleLocation       Vehicle Location's ID.
 * 
 * @apiDescription This allows for permanent deletion of vehicle location record by admin.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 Deleted
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "message": "This vehicle is really new. I am about to return it to you in 20 minutes. Nice ride!",
 *                  "for_vehicle": "641998f45d6408b13cb229b0",
 *                  "for_vehicle_hire": "641998f45d6408b13cb229b0",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "VehicleLocation 641998f45d6408b13cb229b0 has been permanently deleted"
 *     }
 * 
 * @apiError VehicleLocationDeleteErrors Possible error messages.
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
 *     HTTP/1.1 404 VehicleLocationNotFound
 *     {
 *       "message": "No vehicle location matches the vehicle location record 641998f45d6408b13cb229b0"
 *     }
 */
const deleteVehicleLocation = async (req, res) => {
    // Consider not implementing this route on the client side. Rather, it is strongly recommended to use the "softDeleteVehicle" method above. 

    let validatedData;
    try {
        validatedData = await getVehicleLocationSchema.validateAsync({ vehicleLocation: req.params.vehicleLocation })
    } catch (error) {
        return res.status(400).json({ message: "Parameter validation failed", details: `${error}` });
    }

    const vehicleLocationFound = await Vehicle.findOne({ _id: validatedData.vehicleLocation }).exec();
    if (!vehicleLocationFound) {
        return res.status(404).json({ message: `No vehicle location matches the vehicle location record ${validatedData.vehicleLocation}` });
    }

    const deletedVehicleLocation = await vehicleLocationFound.deleteOne();

    res.status(200).json({ success: `Vehicle location ${deletedVehicleLocation._id} has been permanently deleted` })
};


module.exports = {
    getAllVehiclesLocations, 
    getAllUserVehiclesLocations, 
    getAllAuthUserVehiclesLocations, 
    getAllCurrentVehicleLocations,
    addUpdateVehicleLocation, 
    softDeleteVehicleLocation, 
    reactivateSoftDeletedVehicleLocation, 
    deleteVehicleLocation
}