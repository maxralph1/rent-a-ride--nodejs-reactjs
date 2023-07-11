const cloudinaryImageUpload = require('../config/imageUpload/cloudinary');
const Vehicle = require('../models/Vehicle');
const VehicleHire = require('../models/VehicleHire');
const VehicleLocation = require('../models/VehicleLocation');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Interaction = require('../models/Interaction');
const getVehicleSchema = require('../requestValidators/vehicles/getVehicleValidator');
const createVehicleSchema = require('../requestValidators/vehicles/createVehicleValidator');
const updateVehicleSchema = require('../requestValidators/vehicles/updateVehicleValidator');
const getUserSchema = require('../requestValidators/users/getUserValidator');
const searchSchema = require('../requestValidators/searchValidator');


/**
 * @apiGroup Vehicles
 * @apiPermission auth, admin
 * @api {get} /api/v1/vehicles 00. Get All Vehicles
 * @apiName GetVehicles
 * 
 * @apiDescription This retrieves all vehicles.
 *
 * @apiSuccess {String} _id Vehicle ID.
 * @apiSuccess {String} vehicle_type Vehicle type (enum: ['Sedan', 'Bike', 'Bicycle', 'SUV', 'Wagon', 'Truck', 'others']).
 * @apiSuccess {String} vehicle_type_if_others Vehicle type (if not included on the list above).
 * @apiSuccess {String} vehicle_brand Vehicle brand.
 * @apiSuccess {String} vehicle_model Vehicle model.
 * @apiSuccess {String} vehicle_engine_number Vehicle engine number.
 * @apiSuccess {String} vehicle_identification_number Vehicle ID number.
 * @apiSuccess {String} vehicle_plate_number Vehicle plate number.
 * @apiSuccess {ArrayofStrings} vehicle_images_paths Vehicle image paths.
 * @apiSuccess {String} vehicle_hire_rate_in_figures Vehicle hire rate in figures.
 * @apiSuccess {String} vehicle_hire_rate_currency Vehicle hire rate currency (enum: ['USD', 'Euro', 'British Pound']).
 * @apiSuccess {String} vehicle_hire_charge_per_timing Vehicle hire rate currency (enum: ['minutes', 'seconds', 'hourly', 'days', 'negotiable']).
 * @apiSuccess {String} maximum_allowable_distance Vehicle maximum allowable distance as specified by owner.
 * @apiSuccess {String} status Vehicle availability status (enum: ['Available', 'Maintenance', 'Rented', 'Reserved']).
 * @apiSuccess {Object} ratings Ratings on vehicle.
 * @apiSuccess {Object} comments Comments on vehicle.
 * @apiSuccess {Boolean} verified Vehicle verification status by admin.
 * @apiSuccess {Boolean} company_owned Vehicle ownership.
 * @apiSuccess {String} added_by Admin accounr responsible for registering vehicle.
 * @apiSuccess {Boolean} active Vehicle active/deletion status.
 * @apiSuccess {String} deleted_at Vehicle deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "vehicle_type": "Sedan",
 *                  "vehicle_type_if_others": "Flying Truck",
 *                  "vehicle_brand": "Mercedes Benz",
 *                  "vehicle_model": "S-Class",
 *                  "vehicle_engine_number": "ABC123456DEF78910",
 *                  "vehicle_identification_number": "ABC123456DEF78910",
 *                  "vehicle_plate_number": "ABC123456DEF78910",
 *                  "last_name": "Snow",
 *                  "vehicle_images_paths": {"https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg", "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "vehicle_hire_rate_in_figures": "20",
 *                  "vehicle_hire_rate_currency": "USD",
 *                  "vehicle_hire_charge_per_timing": "seconds",
 *                  "maximum_allowable_distance": "20km",
 *                  "status": "Available",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "verified": "true",
 *                  "company_owned": "true",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "active": true,
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no vehicles found. Impossible as the authenticated vehicle is already a vehicle.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Vehicles found"
 *     }
 */
const getAllVehicles = async (req, res) => {
    const vehicles = await Vehicle.find().sort('-created_at').lean();
    if (!vehicles?.length) return res.status(404).json({ message: "No vehicles found" });

    res.status(200).json({ data: vehicles });
};

/**
 * @apiGroup Vehicles
 * @apiPermission auth
 * @api {get} /api/v1/vehicles/my-vehicles 01. Get All Currently Authenticated User Vehicles
 * @apiName GetAuthUserVehicles
 * 
 * @apiDescription This retrieves all current authenticated user's vehicles.
 *
 * @apiSuccess {String} _id Vehicle ID.
 * @apiSuccess {String} vehicle_type Vehicle type (enum: ['Sedan', 'Bike', 'Bicycle', 'SUV', 'Wagon', 'Truck', 'others']).
 * @apiSuccess {String} vehicle_type_if_others Vehicle type (if not included on the list above).
 * @apiSuccess {String} vehicle_brand Vehicle brand.
 * @apiSuccess {String} vehicle_model Vehicle model.
 * @apiSuccess {String} vehicle_engine_number Vehicle engine number.
 * @apiSuccess {String} vehicle_identification_number Vehicle ID number.
 * @apiSuccess {String} vehicle_plate_number Vehicle plate number.
 * @apiSuccess {ArrayofStrings} vehicle_images_paths Vehicle image paths.
 * @apiSuccess {String} vehicle_hire_rate_in_figures Vehicle hire rate in figures.
 * @apiSuccess {String} vehicle_hire_rate_currency Vehicle hire rate currency (enum: ['USD', 'Euro', 'British Pound']).
 * @apiSuccess {String} vehicle_hire_charge_per_timing Vehicle hire rate currency (enum: ['minutes', 'seconds', 'hourly', 'days', 'negotiable']).
 * @apiSuccess {String} maximum_allowable_distance Vehicle maximum allowable distance as specified by owner.
 * @apiSuccess {String} status Vehicle availability status (enum: ['Available', 'Maintenance', 'Rented', 'Reserved']).
 * @apiSuccess {Object} ratings Ratings on vehicle.
 * @apiSuccess {Object} comments Comments on vehicle.
 * @apiSuccess {Boolean} verified Vehicle verification status by admin.
 * @apiSuccess {Boolean} company_owned Vehicle ownership.
 * @apiSuccess {String} added_by Admin account responsible for registering vehicle.
 * @apiSuccess {Boolean} active Vehicle active/deletion status.
 * @apiSuccess {String} deleted_at Vehicle deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "vehicle_type": "Sedan",
 *                  "vehicle_type_if_others": "Flying Truck",
 *                  "vehicle_brand": "Mercedes Benz",
 *                  "vehicle_model": "S-Class",
 *                  "vehicle_engine_number": "ABC123456DEF78910",
 *                  "vehicle_identification_number": "ABC123456DEF78910",
 *                  "vehicle_plate_number": "ABC123456DEF78910",
 *                  "last_name": "Snow",
 *                  "vehicle_images_paths": {"https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg", "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "vehicle_hire_rate_in_figures": "20",
 *                  "vehicle_hire_rate_currency": "USD",
 *                  "vehicle_hire_charge_per_timing": "seconds",
 *                  "maximum_allowable_distance": "20km",
 *                  "status": "Available",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "verified": "true",
 *                  "company_owned": "true",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "active": true,
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }, ...
 *     }
 * 
 * @apiError AuthUserVehiclesErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthenticated
 *     {
 *       "message": "You are not logged in. You can only access logged in user's vehicles if you own those vehicles and logged in. Otherwise, you may wish to log in to view your vehicles or go to the vehicle feeds for random vehicles"
 *     }
 * 
 *     HTTP/1.1 404 VehicleNotFound
 *     {
 *       "message": "No Vehicles found"
 *     }
 */
const getAuthUserVehicles = async (req, res) => {
    const userFound = await User.findOne({ _id: req.user_id }).exec();
    
    if (!userFound) return res.status(404).json({ message: "You are not logged in. You can only access logged in user's vehicles if you own those vehicles and logged in. Otherwise, you may wish to log in to view your vehicles or go to the vehicle feeds for random vehicles" });

    const vehicles = await Vehicle.find({ added_by: userFound._id }).exec();
    if (!vehicles?.length) return res.status(404).json({ message: "Found no vehicles belonging to user" });

    res.status(200).json({ data: vehicles });
}

/**
 * @apiGroup Vehicles
 * @apiPermission public
 * @api {get} /api/v1/vehicles/user/:user 02. Get Vehicles Belonging to User
 * @apiName GetUserVehicles
 * 
 * @apiParam {String} user User's IDs.
 * 
 * @apiDescription This retrieves all vehicles belonging to user.
 *
 * @apiSuccess {String} _id Vehicle ID.
 * @apiSuccess {String} vehicle_type Vehicle type (enum: ['Sedan', 'Bike', 'Bicycle', 'SUV', 'Wagon', 'Truck', 'others']).
 * @apiSuccess {String} vehicle_type_if_others Vehicle type (if not included on the list above).
 * @apiSuccess {String} vehicle_brand Vehicle brand.
 * @apiSuccess {String} vehicle_model Vehicle model.
 * @apiSuccess {String} vehicle_engine_number Vehicle engine number.
 * @apiSuccess {String} vehicle_identification_number Vehicle ID number.
 * @apiSuccess {String} vehicle_plate_number Vehicle plate number.
 * @apiSuccess {ArrayofStrings} vehicle_images_paths Vehicle image paths.
 * @apiSuccess {String} vehicle_hire_rate_in_figures Vehicle hire rate in figures.
 * @apiSuccess {String} vehicle_hire_rate_currency Vehicle hire rate currency (enum: ['USD', 'Euro', 'British Pound']).
 * @apiSuccess {String} vehicle_hire_charge_per_timing Vehicle hire rate currency (enum: ['minutes', 'seconds', 'hourly', 'days', 'negotiable']).
 * @apiSuccess {String} maximum_allowable_distance Vehicle maximum allowable distance as specified by owner.
 * @apiSuccess {String} status Vehicle availability status (enum: ['Available', 'Maintenance', 'Rented', 'Reserved']).
 * @apiSuccess {Object} ratings Ratings on vehicle.
 * @apiSuccess {Object} comments Comments on vehicle.
 * @apiSuccess {Boolean} verified Vehicle verification status by admin.
 * @apiSuccess {Boolean} company_owned Vehicle ownership.
 * @apiSuccess {String} added_by Admin accounr responsible for registering vehicle.
 * @apiSuccess {Boolean} active Vehicle active/deletion status.
 * @apiSuccess {String} deleted_at Vehicle deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  {
 *                      "_id": "641998f45d6408b13cb229b0",
 *                      "vehicle_type": "Sedan",
 *                      "vehicle_type_if_others": "Flying Truck",
 *                      "vehicle_brand": "Mercedes Benz",
 *                      "vehicle_model": "S-Class",
 *                      "vehicle_engine_number": "ABC123456DEF78910",
 *                      "vehicle_identification_number": "ABC123456DEF78910",
 *                      "vehicle_plate_number": "ABC123456DEF78910",
 *                      "last_name": "Snow",
 *                      "vehicle_images_paths": {"https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg", "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                      "vehicle_hire_rate_in_figures": "20",
 *                      "vehicle_hire_rate_currency": "USD",
 *                      "vehicle_hire_charge_per_timing": "seconds",
 *                      "maximum_allowable_distance": "20km",
 *                      "status": "Available",
 *                      "ratings": {"641998f45d6408b13cb229b0", ...},
 *                      "comments": {"641998f45d6408b13cb229b0", ...},
 *                      "verified": "true",
 *                      "company_owned": "true",
 *                      "added_by": "641998f45d6408b13cb229b0",
 *                      "active": true,
 *                      "created_at": "2023-07-01T10:59:17.117+00:00"
 *                      "updated_at": "2023-07-01T10:59:17.117+00:00"
 *                      "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                  },
 *                  {
 *                      "_id": "641998f45d6408b13cb229b0",
 *                      "vehicle_type": "Sedan",
 *                      "vehicle_type_if_others": "Flying Truck",
 *                      "vehicle_brand": "Mercedes Benz",
 *                      "vehicle_model": "S-Class",
 *                      "vehicle_engine_number": "ABC123456DEF78910",
 *                      "vehicle_identification_number": "ABC123456DEF78910",
 *                      "vehicle_plate_number": "ABC123456DEF78910",
 *                      "last_name": "Snow",
 *                      "vehicle_images_paths": {"https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg", "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                      "vehicle_hire_rate_in_figures": "20",
 *                      "vehicle_hire_rate_currency": "USD",
 *                      "vehicle_hire_charge_per_timing": "seconds",
 *                      "maximum_allowable_distance": "20km",
 *                      "status": "Available",
 *                      "ratings": {"641998f45d6408b13cb229b0", ...},
 *                      "comments": {"641998f45d6408b13cb229b0", ...},
 *                      "verified": "true",
 *                      "company_owned": "true",
 *                      "added_by": "641998f45d6408b13cb229b0",
 *                      "active": true,
 *                      "created_at": "2023-07-01T10:59:17.117+00:00"
 *                      "updated_at": "2023-07-01T10:59:17.117+00:00"
 *                      "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                  }, ...
 *               }
 *     }
 * 
 * @apiError UserVehiclesErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Vehicle parameter validation failed",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 404 VehicleNotFound
 *     {
 *       "message": "Found no vehicles belonging to user"
 *     }
 */
const getUserVehicles = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getUserSchema.validateAsync({ user: req.params.user })
    } catch (error) {
        return res.status(400).json({ message: "Vehicle key validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ username: validatedData.user }).exec();

    if (!userFound) return res.status(404).json({ message: "User does not exist. Perhaps, you should search by their names or other identification markers to see if you could find the user you are looking for." });

    const vehicles = await Vehicle.find({ added_by: userFound._id })
        .select(['-active', 'deleted_at', '-created_at', '-updated_at'])
        .lean();
    if (!vehicles?.length) return res.status(404).json({ message: "Found no vehicles belonging to user" });

    res.status(200).json({ data: vehicles });
}

/**
 * @apiGroup Vehicles
 * @apiPermission public
 * @api {get} /api/v1/vehicles/search/:searchKey 03. Search (Find) Vehicles
 * @apiName SearchVehicles
 * 
 * @apiParam {String} searchKey Vehicle's search key (vehicle_type, vehicle_type_if_others, vehicle_brand, vehicle_model, vehicle_hire_rate_in_figures or vehicle_hire_rate_currency).
 * 
 * @apiDescription This retrieves vehicles based on the search key.
 *
 * @apiSuccess {String} _id Vehicle ID.
 * @apiSuccess {String} vehicle_type Vehicle type (enum: ['Sedan', 'Bike', 'Bicycle', 'SUV', 'Wagon', 'Truck', 'others']).
 * @apiSuccess {String} vehicle_type_if_others Vehicle type (if not included on the list above).
 * @apiSuccess {String} vehicle_brand Vehicle brand.
 * @apiSuccess {String} vehicle_model Vehicle model.
 * @apiSuccess {String} vehicle_engine_number Vehicle engine number.
 * @apiSuccess {String} vehicle_identification_number Vehicle ID number.
 * @apiSuccess {String} vehicle_plate_number Vehicle plate number.
 * @apiSuccess {ArrayofStrings} vehicle_images_paths Vehicle image paths.
 * @apiSuccess {String} vehicle_hire_rate_in_figures Vehicle hire rate in figures.
 * @apiSuccess {String} vehicle_hire_rate_currency Vehicle hire rate currency (enum: ['USD', 'Euro', 'British Pound']).
 * @apiSuccess {String} vehicle_hire_charge_per_timing Vehicle hire rate currency (enum: ['minutes', 'seconds', 'hourly', 'days', 'negotiable']).
 * @apiSuccess {String} maximum_allowable_distance Vehicle maximum allowable distance as specified by owner.
 * @apiSuccess {String} status Vehicle availability status (enum: ['Available', 'Maintenance', 'Rented', 'Reserved']).
 * @apiSuccess {Object} ratings Ratings on vehicle.
 * @apiSuccess {Object} comments Comments on vehicle.
 * @apiSuccess {Boolean} verified Vehicle verification status by admin.
 * @apiSuccess {Boolean} company_owned Vehicle ownership.
 * @apiSuccess {String} added_by Admin accounr responsible for registering vehicle.
 * @apiSuccess {Boolean} active Vehicle active/deletion status.
 * @apiSuccess {String} deleted_at Vehicle deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "vehicle_type": "Sedan",
 *                  "vehicle_type_if_others": "Flying Truck",
 *                  "vehicle_brand": "Mercedes Benz",
 *                  "vehicle_model": "S-Class",
 *                  "vehicle_engine_number": "ABC123456DEF78910",
 *                  "vehicle_identification_number": "ABC123456DEF78910",
 *                  "vehicle_plate_number": "ABC123456DEF78910",
 *                  "last_name": "Snow",
 *                  "vehicle_images_paths": {"https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg", "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "vehicle_hire_rate_in_figures": "20",
 *                  "vehicle_hire_rate_currency": "USD",
 *                  "vehicle_hire_charge_per_timing": "seconds",
 *                  "maximum_allowable_distance": "20km",
 *                  "status": "Available",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "verified": "true",
 *                  "company_owned": "true",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "active": true,
 *                  "created_at": "2023-07-01T10:59:17.117+00:00"
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00"
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               },
 *               {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "vehicle_type": "Sedan",
 *                  "vehicle_type_if_others": "Flying Truck",
 *                  "vehicle_brand": "Mercedes Benz",
 *                  "vehicle_model": "S-Class",
 *                  "vehicle_engine_number": "ABC123456DEF78910",
 *                  "vehicle_identification_number": "ABC123456DEF78910",
 *                  "vehicle_plate_number": "ABC123456DEF78910",
 *                  "last_name": "Snow",
 *                  "vehicle_images_paths": {"https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg", "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "vehicle_hire_rate_in_figures": "20",
 *                  "vehicle_hire_rate_currency": "USD",
 *                  "vehicle_hire_charge_per_timing": "seconds",
 *                  "maximum_allowable_distance": "20km",
 *                  "status": "Available",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "verified": "true",
 *                  "company_owned": "true",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "active": true,
 *                  "created_at": "2023-07-01T10:59:17.117+00:00"
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00"
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no matching vehicle(s) found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Vehicle found"
 *     }
 */
const searchVehicles = async (req, res) => {
    if (!req?.params?.search) return res.status(400).json({ message: "Search key required" });

    let validatedData;
    try {
        validatedData = await searchSchema.validateAsync({ search: req.params.search })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }

    const vehicles = await Vehicle.find({$or: [{vehicle_brand: new RegExp(validatedData.search, 'i')}, {vehicle_model: new RegExp(validatedData.search, 'i')}]})
        .select(['-active', 'deleted_at', '-created_at', '-updated_at'])
        .where({ active: true })
        .lean();

    if (!vehicles?.length) return res.status(404).json({ message: "No vehicle found" });

    res.status(200).json({ data: vehicles });
}

/**
 * @apiGroup Vehicles
 * @apiPermission public
 * @api {get} /api/v1/vehicles/:vehicle 04. Get Vehicle
 * @apiName GetVehicle
 * 
 * @apiParam {String} vehicle Vehicle's ID.
 * 
 * @apiDescription This retrieves vehicle based on the :vehicle parameter.
 *
 * @apiSuccess {String} _id Vehicle ID.
 * @apiSuccess {String} vehicle_type Vehicle type (enum: ['Sedan', 'Bike', 'Bicycle', 'SUV', 'Wagon', 'Truck', 'others']).
 * @apiSuccess {String} vehicle_type_if_others Vehicle type (if not included on the list above).
 * @apiSuccess {String} vehicle_brand Vehicle brand.
 * @apiSuccess {String} vehicle_model Vehicle model.
 * @apiSuccess {String} vehicle_engine_number Vehicle engine number.
 * @apiSuccess {String} vehicle_identification_number Vehicle ID number.
 * @apiSuccess {String} vehicle_plate_number Vehicle plate number.
 * @apiSuccess {ArrayofStrings} vehicle_images_paths Vehicle image paths.
 * @apiSuccess {String} vehicle_hire_rate_in_figures Vehicle hire rate in figures.
 * @apiSuccess {String} vehicle_hire_rate_currency Vehicle hire rate currency (enum: ['USD', 'Euro', 'British Pound']).
 * @apiSuccess {String} vehicle_hire_charge_per_timing Vehicle hire rate currency (enum: ['minutes', 'seconds', 'hourly', 'days', 'negotiable']).
 * @apiSuccess {String} maximum_allowable_distance Vehicle maximum allowable distance as specified by owner.
 * @apiSuccess {String} status Vehicle availability status (enum: ['Available', 'Maintenance', 'Rented', 'Reserved']).
 * @apiSuccess {Object} ratings Ratings on vehicle.
 * @apiSuccess {Object} comments Comments on vehicle.
 * @apiSuccess {Boolean} verified Vehicle verification status by admin.
 * @apiSuccess {Boolean} company_owned Vehicle ownership.
 * @apiSuccess {String} added_by Admin accounr responsible for registering vehicle.
 * @apiSuccess {Boolean} active Vehicle active/deletion status.
 * @apiSuccess {String} deleted_at Vehicle deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "vehicle_type": "Sedan",
 *                  "vehicle_type_if_others": "Flying Truck",
 *                  "vehicle_brand": "Mercedes Benz",
 *                  "vehicle_model": "S-Class",
 *                  "vehicle_engine_number": "ABC123456DEF78910",
 *                  "vehicle_identification_number": "ABC123456DEF78910",
 *                  "vehicle_plate_number": "ABC123456DEF78910",
 *                  "last_name": "Snow",
 *                  "vehicle_images_paths": {"https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg", "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "vehicle_hire_rate_in_figures": "20",
 *                  "vehicle_hire_rate_currency": "USD",
 *                  "vehicle_hire_charge_per_timing": "seconds",
 *                  "maximum_allowable_distance": "20km",
 *                  "status": "Available",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "verified": "true",
 *                  "company_owned": "true",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "active": true,
 *                  "created_at": "2023-07-01T10:59:17.117+00:00"
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00"
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }
 *     }
 * 
 * @apiError NotFound Possible error message if no matching vehicle found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Vehicle matches vehicle 641998f45d6408b13cb229b0"
 *     }
 */
const getVehicle = async (req, res) => {
    if (!req?.params?.vehicle) return res.status(400).json({ message: "Vehicle required" });

    let validatedData;
    try {
        validatedData = await getVehicleSchema.validateAsync({ vehicle: req.params.vehicle })
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleFound = await Vehicle.findOne({ _id: validatedData.vehicle })
        .select(['-active', 'deleted_at', '-created_at', '-updated_at'])
        .lean();
    if (!vehicleFound) {
        return res.status(404).json({ message: `No vehicle matches vehicle ${validatedData.vehicle}` });
    }

    res.status(200).json({ data: vehicleFound });
};

/**
 * @apiGroup Vehicles
 * @apiPermission auth, owner
 * @api {post} /api/v1/vehicles 05. Create New Vehicle
 * @apiName CreateNewVehicle
 * 
 * @apiDescription This creates a new vehicle.
 * 
 * @apiBody {String} vehicle_type     Type of vehicle.
 * @apiBody {String} [vehicle_type_if_others]     If type of vehicle not included on the list.
 * @apiBody {String} vehicle_brand     Brand of vehicle.
 * @apiBody {String} vehicle_model       Model of vehicle.
 * @apiBody {String} vehicle_engine_number       Engine number of vehicle.
 * @apiBody {String} vehicle_identification_number       ID number of vehicle.
 * @apiBody {String} vehicle_plate_number       Plate number of vehicle.
 * @apiBody {String} vehicle_hire_rate_in_figures       The hire price (rate) as fixed by the vehicle owner.
 * @apiBody {String} vehicle_hire_rate_currency       The hire price (rate) currency as fixed by the vehicle owner.
 * @apiBody {String} vehicle_hire_charge_per_timing       The hire price (rate) charge per timing as fixed by the vehicle owner
 * @apiBody {String} maximum_allowable_distance       Maximum allowable distance as fixed by vehicle owner.
 * @apiBody {String} status       Availability status of vehicle.
 * @apiBody {File} vehicle_photos       Vehicle photos.
 * @apiExample {json} Request Body:
 *     {
 *       "vehicle_type": "Sedan",
 *       "vehicle_type_if_others": "Flying Truck",
 *       "vehicle_brand": "Mercedes Benz",
 *       "vehicle_model": "S-Class",
 *       "vehicle_engine_number": "ABC123456DEF78910",
 *       "vehicle_identification_number": "ABC123456DEF78910",
 *       "vehicle_plate_number": "ABC123456DEF78910",
 *       "vehicle_hire_rate_in_figures": "20",
 *       "vehicle_hire_rate_currency": "USD",
 *       "vehicle_hire_charge_per_timing": "minutes",
 *       "maximum_allowable_distance": "123km",
 *       "status": "Available",
 *       "vehicle_photos": (image file)
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 VehicleCreated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "vehicle_type": "Sedan",
 *                  "vehicle_type_if_others": "Flying Truck",
 *                  "vehicle_brand": "Mercedes Benz",
 *                  "vehicle_model": "S-Class",
 *                  "vehicle_engine_number": "ABC123456DEF78910",
 *                  "vehicle_identification_number": "ABC123456DEF78910",
 *                  "vehicle_plate_number": "ABC123456DEF78910",
 *                  "last_name": "Snow",
 *                  "vehicle_images_paths": {"https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg", "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "vehicle_hire_rate_in_figures": "20",
 *                  "vehicle_hire_rate_currency": "USD",
 *                  "vehicle_hire_charge_per_timing": "seconds",
 *                  "maximum_allowable_distance": "20km",
 *                  "status": "Available",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "verified": "true",
 *                  "company_owned": "true",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "active": true,
 *                  "created_at": "2023-07-01T10:59:17.117+00:00"
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00"
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "Vehicle Mercedes Benz S-Class — ABC123456DEF78910 added"
 *     }
 * 
 * @apiError CreateVehicleErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "An error occured",
 *       "details": "..."
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
 */
const createVehicle = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createVehicleSchema.validateAsync({ vehicle_type: req.body.vehicle_type, 
                                                                vehicle_type_if_others: req.body.vehicle_type_if_others, 
                                                                vehicle_brand: req.body.vehicle_brand, 
                                                                vehicle_model: req.body.vehicle_model,  
                                                                vehicle_engine_number: req.body.vehicle_engine_number, 
                                                                vehicle_identification_number: req.body.vehicle_identification_number, 
                                                                vehicle_plate_number: req.body.vehicle_plate_number, 
                                                                vehicle_hire_rate_in_figures: req.body.vehicle_hire_rate_in_figures, 
                                                                vehicle_hire_rate_currency: req.body.vehicle_hire_rate_currency, 
                                                                vehicle_hire_charge_per_timing: req.body.vehicle_hire_charge_per_timing, 
                                                                maximum_allowable_distance: req.body.maximum_allowable_distance, 
                                                                status: req.body.status });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const user = await User.findOne({ _id: req.user_id }).exec();
    if (!user) return res.status(401).json({ message: "You must be signed in to add a vehicle. You may sign up for an account, if you do not have one." });

    const files = req.files.vehicle_photos;

    const urls = []

    if (Array.isArray(files)) {
        for (const file of files) {
            const imageUpload = await cloudinaryImageUpload(file.tempFilePath, "rent_a_ride_vehicle_images");
            if (!imageUpload) return res.status(400).json({ message: "Image upload failed" });
            
            urls.push(imageUpload.secure_url)
        }
    } else {
        const imageUpload = await cloudinaryImageUpload(files.tempFilePath, "rent_a_ride_vehicle_images");
        if (!imageUpload) return res.status(400).json({ message: "Image upload failed" });

        urls.push(imageUpload.secure_url)
    }

    const newVehicle = new Vehicle({
        vehicle_type: validatedData.vehicle_type,
        vehicle_type_if_others: validatedData.vehicle_type_if_others,
        vehicle_brand: validatedData.vehicle_brand,
        vehicle_model: validatedData.vehicle_model,
        vehicle_engine_number: validatedData.vehicle_engine_number,
        vehicle_identification_number: validatedData.vehicle_identification_number,
        vehicle_plate_number: validatedData.vehicle_plate_number,
        vehicle_hire_rate_in_figures: validatedData.vehicle_hire_rate_in_figures,
        vehicle_hire_rate_currency: validatedData.vehicle_hire_rate_currency,
        vehicle_hire_charge_per_timing: validatedData.vehicle_hire_charge_per_timing,
        maximum_allowable_distance: validatedData.maximum_allowable_distance,
        status: validatedData.status,    
        vehicle_images_paths: urls,
        active: true,
        added_by: req.user_id
    });

    newVehicle.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ success: `Vehicle ${newVehicle.vehicle_brand} ${newVehicle.vehicle_model} — ${newVehicle.vehicle_plate_number} added`, data: newVehicle });
    });
};

/**
 * @apiGroup Vehicles
 * @apiPermission auth, owner
 * @api {patch} /api/v1/vehicles/:vehicle 06. Update Vehicle
 * @apiName UpdateVehicle
 * 
 * @apiParam {String} vehicle Vehicle's ID.
 * 
 * @apiDescription This updates an existing vehicle.
 * 
 * @apiBody {String} [vehicle_type]     Type of vehicle.
 * @apiBody {String} [vehicle_type_if_others]     If type of vehicle not included on the list.
 * @apiBody {String} [vehicle_brand]     Brand of vehicle.
 * @apiBody {String} [vehicle_model]       Model of vehicle.
 * @apiBody {String} [vehicle_engine_number]       Engine number of vehicle.
 * @apiBody {String} [vehicle_identification_number]       ID number of vehicle.
 * @apiBody {String} [vehicle_plate_number]       Plate number of vehicle.
 * @apiBody {String} [vehicle_hire_rate_in_figures]       The hire price (rate) as fixed by the vehicle owner.
 * @apiBody {String} [vehicle_hire_rate_currency]       The hire price (rate) currency as fixed by the vehicle owner.
 * @apiBody {String} [vehicle_hire_charge_per_timing]       The hire price (rate) charge per timing as fixed by the vehicle owner
 * @apiBody {String} [maximum_allowable_distance]       Maximum allowable distance as fixed by vehicle owner.
 * @apiBody {String} [status]       Availability status of vehicle.
 * @apiBody {File} [vehicle_photos]       Vehicle photos.
 * @apiExample {json} Request Body:
 *     {
 *       "vehicle_type": "Sedan",
 *       "vehicle_type_if_others": "Flying Truck",
 *       "vehicle_brand": "Mercedes Benz",
 *       "vehicle_model": "S-Class",
 *       "vehicle_engine_number": "ABC123456DEF78910",
 *       "vehicle_identification_number": "ABC123456DEF78910",
 *       "vehicle_plate_number": "ABC123456DEF78910",
 *       "vehicle_hire_rate_in_figures": "20",
 *       "vehicle_hire_rate_currency": "USD",
 *       "vehicle_hire_charge_per_timing": "minutes",
 *       "maximum_allowable_distance": "123km",
 *       "status": "Available",
 *       "vehicle_photos": (image file)
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 VehicleUpdated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "vehicle_type": "Sedan",
 *                  "vehicle_type_if_others": "Flying Truck",
 *                  "vehicle_brand": "Mercedes Benz",
 *                  "vehicle_model": "S-Class",
 *                  "vehicle_engine_number": "ABC123456DEF78910",
 *                  "vehicle_identification_number": "ABC123456DEF78910",
 *                  "vehicle_plate_number": "ABC123456DEF78910",
 *                  "last_name": "Snow",
 *                  "vehicle_images_paths": {"https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg", "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "vehicle_hire_rate_in_figures": "20",
 *                  "vehicle_hire_rate_currency": "USD",
 *                  "vehicle_hire_charge_per_timing": "seconds",
 *                  "maximum_allowable_distance": "20km",
 *                  "status": "Available",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "verified": "true",
 *                  "company_owned": "true",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "active": true,
 *                  "created_at": "2023-07-01T10:59:17.117+00:00"
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00"
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "Vehicle record updated"
 *     }
 * 
 * @apiError VehicleUpdateErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "An error occured",
 *       "details": "..."
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
 *       "message": "You do not have permission to update vehicles that do not belong to you"
 *     }
 * 
 *     HTTP/1.1 404 VehicleNotFound
 *     {
 *       "message": "Vehicle not found"
 *     }
 */
const updateVehicle = async (req, res) => {
    let validatedData;
    try {
        validatedData = await updateVehicleSchema.validateAsync({ vehicle: req.params.vehicle, 
                                                                vehicle_type: req.body.vehicle_type, 
                                                                vehicle_type_if_others: req.body.vehicle_type_if_others, 
                                                                vehicle_brand: req.body.vehicle_brand, 
                                                                vehicle_model: req.body.vehicle_model,  
                                                                vehicle_engine_number: req.body.vehicle_engine_number, 
                                                                vehicle_identification_number: req.body.vehicle_identification_number, 
                                                                vehicle_plate_number: req.body.vehicle_plate_number, 
                                                                vehicle_hire_rate_in_figures: req.body.vehicle_hire_rate_in_figures, 
                                                                vehicle_hire_rate_currency: req.body.vehicle_hire_rate_currency, 
                                                                vehicle_hire_charge_per_timing: req.body.vehicle_hire_charge_per_timing, 
                                                                maximum_allowable_distance: req.body.maximum_allowable_distance, 
                                                                status: req.body.status });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const ifAuthenticatedUser = await User.findOne({ _id: req.user_id }).lean();

    if (ifAuthenticatedUser._id != req.user_id) {
        return res.status(403).json({ message: "You do not have permission to update vehicles that do not belong to you" });

    } else if (ifAuthenticatedUser._id == req.user_id) {

        const vehicleFound = await Vehicle.findOne({ _id: validatedData.vehicle }).exec();
        if (!vehicleFound) return res.status(404).json({ message: "Vehicle not found" });

        const urls = []

        const files = req.files.vehicle_photos;

        if (Array.isArray(files)) {
            for (const file of files) {
                const imageUpload = await cloudinaryImageUpload(file.tempFilePath, "rent_a_ride_vehicle_images");
                if (!imageUpload) return res.status(400).json({ message: "Image upload failed" });
                
                urls.push(imageUpload.secure_url)
            }
        } else {
            const imageUpload = await cloudinaryImageUpload(files.tempFilePath, "rent_a_ride_vehicle_images");
            if (!imageUpload) return res.status(409).json({ message: "Image upload failed" });

            urls.push(imageUpload.secure_url)
        }

        if (validatedData.vehicle_type) vehicleFound.vehicle_type = validatedData.vehicle_type;
        if (validatedData.vehicle_type_if_others) vehicleFound.vehicle_type_if_others = validatedData.vehicle_type_if_others;
        if (validatedData.vehicle_brand) vehicleFound.vehicle_brand = validatedData.vehicle_brand;
        if (validatedData.vehicle_model) vehicleFound.vehicle_model = validatedData.vehicle_model;
        if (validatedData.vehicle_engine_number) vehicleFound.vehicle_engine_number = validatedData.vehicle_engine_number;
        if (validatedData.vehicle_identification_number) vehicleFound.vehicle_identification_number = validatedData.vehicle_identification_number;
        if (validatedData.vehicle_plate_number) vehicleFound.vehicle_plate_number = validatedData.vehicle_plate_number;
        if (validatedData.vehicle_hire_rate_in_figures) vehicleFound.vehicle_hire_rate_in_figures = validatedData.vehicle_hire_rate_in_figures;
        if (validatedData.vehicle_hire_rate_currency) vehicleFound.vehicle_hire_rate_currency = validatedData.vehicle_hire_rate_currency;
        if (validatedData.vehicle_hire_charge_per_timing) vehicleFound.vehicle_hire_charge_per_timing = validatedData.vehicle_hire_charge_per_timing;
        if (validatedData.maximum_allowable_distance) vehicleFound.maximum_allowable_distance = validatedData.maximum_allowable_distance;
        if (validatedData.status) vehicleFound.status = validatedData.status;
        if (urls.length) {
            vehicleFound.vehicle_images_paths = urls;
        }
        if (validatedData.verified) vehicleFound.verified = verified;

        const vehicleHasPendingHireUserCannotUpdate = await VehicleHire.findOne({ vehicle: validatedData.vehicle, paid: false }).exec();
        if (vehicleHasPendingHireUserCannotUpdate) return res.status(422).json({ message: "Vehicle has pending unpaid hire. Make sure all pending hires have been paid for before updating vehicle." });

        vehicleFound.save((error) => {
            if (error) {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }
            res.status(200).json({ success: "Vehicle record updated", data: vehicleFound });
        });
    };
};

/**
 * @apiGroup Vehicles
 * @apiPermission auth, owner
 * @api {patch} /api/v1/vehicles/:vehicle 07. Update Vehicle
 * @apiName UpdateVehicle
 * 
 * @apiParam {String} vehicle Vehicle's ID.
 * 
 * @apiDescription This updates an existing vehicle.
 * 
 * @apiBody {String} [vehicle_type]     Type of vehicle.
 * @apiBody {String} [vehicle_type_if_others]     If type of vehicle not included on the list.
 * @apiBody {String} [vehicle_brand]     Brand of vehicle.
 * @apiBody {String} [vehicle_model]       Model of vehicle.
 * @apiBody {String} [vehicle_engine_number]       Engine number of vehicle.
 * @apiBody {String} [vehicle_identification_number]       ID number of vehicle.
 * @apiBody {String} [vehicle_plate_number]       Plate number of vehicle.
 * @apiBody {String} [vehicle_hire_rate_in_figures]       The hire price (rate) as fixed by the vehicle owner.
 * @apiBody {String} [vehicle_hire_rate_currency]       The hire price (rate) currency as fixed by the vehicle owner.
 * @apiBody {String} [vehicle_hire_charge_per_timing]       The hire price (rate) charge per timing as fixed by the vehicle owner
 * @apiBody {String} [maximum_allowable_distance]       Maximum allowable distance as fixed by vehicle owner.
 * @apiBody {String} [status]       Availability status of vehicle.
 * @apiBody {String} [verified]       Verification status of vehicle by admin.
 * @apiBody {String} [active]       Active/inactive status of vehicle.
 * @apiBody {String} [company_owned]       Company ownership status of vehicle.
 * @apiBody {String} [deleted_at]       Date of deletion (if exists) of vehicle.
 * @apiBody {File} [vehicle_photos]       Vehicle photos.
 * @apiExample {json} Request Body:
 *     {
 *       "vehicle_type": "Sedan",
 *       "vehicle_type_if_others": "Flying Truck",
 *       "vehicle_brand": "Mercedes Benz",
 *       "vehicle_model": "S-Class",
 *       "vehicle_engine_number": "ABC123456DEF78910",
 *       "vehicle_identification_number": "ABC123456DEF78910",
 *       "vehicle_plate_number": "ABC123456DEF78910",
 *       "vehicle_hire_rate_in_figures": "20",
 *       "vehicle_hire_rate_currency": "USD",
 *       "vehicle_hire_charge_per_timing": "minutes",
 *       "maximum_allowable_distance": "123km",
 *       "status": "Available",
 *       "verified": "true",
 *       "active": "true",
 *       "company_owned": "false",
 *       "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *       "vehicle_photos": (image file)
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 VehicleUpdated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "vehicle_type": "Sedan",
 *                  "vehicle_type_if_others": "Flying Truck",
 *                  "vehicle_brand": "Mercedes Benz",
 *                  "vehicle_model": "S-Class",
 *                  "vehicle_engine_number": "ABC123456DEF78910",
 *                  "vehicle_identification_number": "ABC123456DEF78910",
 *                  "vehicle_plate_number": "ABC123456DEF78910",
 *                  "last_name": "Snow",
 *                  "vehicle_images_paths": {"https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg", "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "vehicle_hire_rate_in_figures": "20",
 *                  "vehicle_hire_rate_currency": "USD",
 *                  "vehicle_hire_charge_per_timing": "seconds",
 *                  "maximum_allowable_distance": "20km",
 *                  "status": "Available",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "verified": "true",
 *                  "company_owned": "true",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "active": true,
 *                  "created_at": "2023-07-01T10:59:17.117+00:00"
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00"
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "Vehicle record updated"
 *     }
 * 
 * @apiError VehicleUpdateErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "An error occured",
 *       "details": "..."
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
 *     HTTP/1.1 404 VehicleNotFound
 *     {
 *       "message": "Vehicle not found"
 *     }
 */
const updateVehicleAdminLevel = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updateVehicleSchema.validateAsync({ vehicle_type: req.body.vehicle_type, 
                                                                vehicle_type_if_others: req.body.vehicle_type_if_others, 
                                                                vehicle_brand: req.body.vehicle_brand, 
                                                                vehicle_model: req.body.vehicle_model,  
                                                                vehicle_engine_number: req.body.vehicle_engine_number, 
                                                                vehicle_identification_number: req.body.vehicle_identification_number, 
                                                                vehicle_plate_number: req.body.vehicle_plate_number, 
                                                                vehicle_hire_rate_in_figures: req.body.vehicle_hire_rate_in_figures, 
                                                                vehicle_hire_rate_currency: req.body.vehicle_hire_rate_currency, 
                                                                vehicle_hire_charge_per_timing: req.body.vehicle_hire_charge_per_timing, 
                                                                maximum_allowable_distance: req.body.maximum_allowable_distance, 
                                                                status: req.body.status,
                                                                verified: req.body.verified, 
                                                                active: req.body.active, 
                                                                company_owned: req.body.company_owned, 
                                                                deleted_at: req.body.deleted_at });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleFound = await Vehicle.findOne({ _id: validatedData.vehicle }).exec();
    if (!vehicleFound) return res.status(404).json({ message: "Vehicle not found" });

    const urls = []

    const files = req.files.vehicle_photos;

    if (Array.isArray(files)) {
        for (const file of files) {
            const imageUpload = await cloudinaryImageUpload(file.tempFilePath, "rent_a_ride_vehicle_images");
            if (!imageUpload) return res.status(400).json({ message: "Image upload failed" });
            
            urls.push(imageUpload.secure_url)
        }
    } else {
        const imageUpload = await cloudinaryImageUpload(files.tempFilePath, "rent_a_ride_vehicle_images");
        if (!imageUpload) return res.status(400).json({ message: "Image upload failed" });

        urls.push(imageUpload.secure_url)
    }

    if (validatedData.vehicle_type) vehicleFound.vehicle_type = validatedData.vehicle_type;
    if (validatedData.vehicle_type_if_others) vehicleFound.vehicle_type_if_others = validatedData.vehicle_type_if_others;
    if (validatedData.vehicle_brand) vehicleFound.vehicle_brand = validatedData.vehicle_brand;
    if (validatedData.vehicle_model) vehicleFound.vehicle_model = validatedData.vehicle_model;
    if (validatedData.vehicle_engine_number) vehicleFound.vehicle_engine_number = validatedData.vehicle_engine_number;
    if (validatedData.vehicle_identification_number) vehicleFound.vehicle_identification_number = validatedData.vehicle_identification_number;
    if (validatedData.vehicle_plate_number) vehicleFound.vehicle_plate_number = validatedData.vehicle_plate_number;
    if (validatedData.vehicle_hire_rate_in_figures) vehicleFound.vehicle_hire_rate_in_figures = validatedData.vehicle_hire_rate_in_figures;
    if (validatedData.vehicle_hire_rate_currency) vehicleFound.vehicle_hire_rate_currency = validatedData.vehicle_hire_rate_currency;
    if (validatedData.vehicle_hire_charge_per_timing) vehicleFound.vehicle_hire_charge_per_timing = validatedData.vehicle_hire_charge_per_timing;
    if (validatedData.maximum_allowable_distance) vehicleFound.maximum_allowable_distance = validatedData.maximum_allowable_distance;
    if (validatedData.status) vehicleFound.status = validatedData.status;
    if (urls.length) {
        vehicleFound.vehicle_images_paths = urls;
    }
    if (validatedData.verified) vehicleFound.verified = verified;
    if (validatedData.active) vehicleFound.active = validatedData.active;
    if (validatedData.company_owned) vehicleFound.company_owned = validatedData.company_owned;
    if (validatedData.deleted_at) vehicleFound.deleted_at = validatedData.deleted_at

    vehicleFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ success: "Vehicle record updated", data: vehicleFound });
    });
};

/**
 * @apiGroup Vehicles
 * @apiPermission auth
 * @api {patch} /api/v1/vehicles/:vehicle/delete 08. Soft-Delete Vehicle (Vehicle Owner Deletes Vehicle)
 * @apiName SoftDeleteVehicle
 * 
 * @apiParam {String} vehicle Vehicle's ID.
 * 
 * @apiDescription This allows vehicle to be deleted by its owner.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 VehicleUpdated
 *     {
 *       "data": {
 *                  "vehicle_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "Vehicle Mercedes Benz S-Class with plate number ABC123456DEF78910 inactivated / deleted"
 *     }
 * 
 * @apiError VehicleSoftDeleteErrors Possible error messages.
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
 *     HTTP/1.1 404 VehicleNotFound
 *     {
 *       "message": "Vehicle not found"
 *     }
 */
const softDeleteVehicle = async (req, res) => {
    // Consider using this method for your delete instead of the "deleteVehicle" method below

    let validatedData;
    try {
        validatedData = await getVehicleSchema.validateAsync({ vehicle: req.params.vehicle });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleFound = await Vehicle.findOne({ _id: validatedData.vehicle }).exec();
    if (!vehicleFound) return res.status(404).json({ message: "Vehicle not found" });

    if (vehicleFound.active == true) {
        vehicleFound.active = false;
        vehicleFound.deleted_at = new Date().toISOString();
    }

    vehicleFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ data: {"vehicle_id": `${vehicleFound._id}`}, success: `Vehicle ${vehicleFound.vehicle_brand} ${vehicleFound.vehicle_model} with plate number ${vehicleFound.vehicle_plate_number} inactivated / deleted` });
    });
}

/**
 * @apiGroup Vehicles
 * @apiPermission auth, admin
 * @api {patch} /api/v1/vehicles/:vehicle/re-activate 09. Re-activate Soft-Deleted Vehicle
 * @apiName ReactivateSoftDeletedVehicle
 * 
 * @apiParam {String} vehicle Vehicle's ID.
 * 
 * @apiDescription This allows soft-deleted vehicle account to be re-activated.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 VehicleReactivated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "vehicle_type": "Sedan",
 *                  "vehicle_type_if_others": "Flying Truck",
 *                  "vehicle_brand": "Mercedes Benz",
 *                  "vehicle_model": "S-Class",
 *                  "vehicle_engine_number": "ABC123456DEF78910",
 *                  "vehicle_identification_number": "ABC123456DEF78910",
 *                  "vehicle_plate_number": "ABC123456DEF78910",
 *                  "last_name": "Snow",
 *                  "vehicle_images_paths": {"https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg", "https://res.cloudinary.com/dntmjpcmr/image/upload/v1684909658/frends_vehicle_images/qrcluilfzrfpzoofvyyc.jpg"},
 *                  "vehicle_hire_rate_in_figures": "20",
 *                  "vehicle_hire_rate_currency": "USD",
 *                  "vehicle_hire_charge_per_timing": "seconds",
 *                  "maximum_allowable_distance": "20km",
 *                  "status": "Available",
 *                  "ratings": {"641998f45d6408b13cb229b0", ...},
 *                  "comments": {"641998f45d6408b13cb229b0", ...},
 *                  "verified": "true",
 *                  "company_owned": "true",
 *                  "added_by": "641998f45d6408b13cb229b0",
 *                  "active": true,
 *                  "created_at": "2023-07-01T10:59:17.117+00:00"
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00"
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "Vehicle Mercedes Benz S-Class with plate number ABC123456DEF78910 reactivated"
 *     }
 * 
 * @apiError VehicleSoftDeleteErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 404 VehicleNotFound
 *     {
 *       "message": "Vehicle not found"
 *     }
 */
const reactivateSoftDeletedVehicle = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getVehicleSchema.validateAsync({ vehicle: req.params.vehicle });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleFound = await Vehicle.findOne({ _id: validatedData.id }).exec();
    if (!vehicleFound) return res.status(404).json({ message: "Vehicle not found" });

    if (vehicleFound.active == false) {
        vehicleFound.active = true;
        vehicleFound.deleted_at = '';
    }

    vehicleFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ success: `Vehicle ${vehicleFound.vehicle_brand} ${vehicleFound.vehicle_model} with plate number ${vehicleFound.vehicle_plate_number} reactivated`, data: vehicleFound });
    });
}

/**
 * @apiGroup Vehicles
 * @apiPermission auth, admin
 * @api {delete} /api/v1/vehicles/:vehicle 10. Delete Vehicle (Permanently)
 * @apiName DeleteVehicle
 * 
 * @apiParam {String} vehicle Vehicle's ID.
 * 
 * @apiDescription This allows for permanent deletion of vehicle account and their other records by admin.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 Deleted
 *     {
 *       "data": {
 *                  "vehicle_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "Vehicle testvehiclename1 and all records belonging to vehicle have been permanently deleted"
 *     }
 * 
 * @apiError VehicleDeleteErrors Possible error messages.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Parameter validation failed"
 *     }
 * 
 *     HTTP/1.1 400 Error
 *     {
 *       "message": "An error occured",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 404 VehicleNotFound
 *     {
 *       "message": "No vehicle matches the vehicle 641998f45d6408b13cb229b0"
 *     }
 * 
 *     HTTP/1.1 404 PostNotFound
 *     {
 *       "message": "Neither post nor vehicle exist"
 *     }
 */
const deleteVehicle = async (req, res) => {
    // Consider not implementing this route on the client side. Rather, it is strongly recommended to use the "softDeleteVehicle" method above. 

    let validatedData;
    try {
        validatedData = await getVehicleSchema.validateAsync({ vehicle: req.params.vehicle })
    } catch (error) {
        return res.status(400).json({ message: "Parameter validation failed", details: `${error}` });
    }

    const vehicleFound = await Vehicle.findOne({ _id: validatedData.vehicle }).exec();
    if (!vehicleFound) {
        return res.status(404).json({ message: `No vehicle matches the vehicle ${validatedData.vehicle}` });
    }

    // Find and delete all other information relating to vehicle; then, the vehicle
    // const payments = await Payment.find({ vehicle: validatedData.vehicle }).exec();
    const vehicleHires = await VehicleHire.find({ vehicle: validatedData.vehicle }).exec();
    const vehicleLocations = await VehicleLocation.find({ vehicle: validatedData.vehicle }).exec();
    const interactions = await Interaction.find({ for_vehicle: validatedData.vehicle }).exec();

    // if (payments) {
    //     await payments.deleteMany();
    // }

    if (vehicleHires) {
        await vehicleHires.deleteMany();
    }

    if (vehicleLocations) {
        await vehicleLocations.deleteMany();
    }

    if (interactions) {
        await interactions.deleteMany();
    }

    const deletedVehicle = await vehicleFound.deleteOne();

    res.status(200).json({ data: {"vehicle_id": `${deletedVehicle._id}`}, success: `Vehicle ${deletedVehicle._id} and all records belonging to vehicle have been permanently deleted` })
};


module.exports = {
    getAllVehicles,
    getAuthUserVehicles, 
    getUserVehicles, 
    searchVehicles, 
    getVehicle, 
    createVehicle,
    updateVehicle,
    updateVehicleAdminLevel,
    softDeleteVehicle,
    reactivateSoftDeletedVehicle,
    deleteVehicle
}