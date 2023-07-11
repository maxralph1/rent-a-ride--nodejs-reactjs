const VehicleHire = require('../models/VehicleHire');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Payment = require('../models/Payment');
const getVehicleHireSchema = require('../requestValidators/vehicleHires/getVehicleHireValidator')
const createVehicleHireSchema = require('../requestValidators/vehicleHires/createVehicleHireValidator');
const updateVehicleHireSchema = require('../requestValidators/vehicleHires/updateVehicleHireValidator');


/**
 * @apiGroup VehicleHires
 * @apiPermission auth, admin
 * @api {get} /api/v1/vehicleHires 00. Get All Vehicle Hires
 * @apiName GetVehicleHires
 * 
 * @apiDescription This retrieves all vehicle hires.
 *
 * @apiSuccess {String} _id Vehicle Hire ID.
 * @apiSuccess {Object} release Vehicle release date/time.
 * @apiSuccess {String} release.date Vehicle release date.
 * @apiSuccess {String} release.time Vehicle release time.
 * @apiSuccess {Object} due_back Vehicle due back date/time.
 * @apiSuccess {String} due_back.date Vehicle due back date.
 * @apiSuccess {String} due_back.time Vehicle due back time.
 * @apiSuccess {Object} return Vehicle return date/time.
 * @apiSuccess {String} return.date Vehicle return date.
 * @apiSuccess {String} return.time Vehicle return time.
 * @apiSuccess {String} vehicle_hire_rate_due_in_figures Vehicle hire rate (cost).
 * @apiSuccess {String} vehicle_hire_rate_due_currency Vehicle hire rate currency (enum: ['USD', 'Euro', 'British Pound']).
 * @apiSuccess {Boolean} paid Vehicle hire paid for/not.
 * @apiSuccess {String} vehicle_hire_charge_timing Vehicle hire charge timing (enum: ['minutes', 'seconds', 'hourly', 'days']).
 * @apiSuccess {String} hiree The user who is hiring the vehicle from the owner.
 * @apiSuccess {String} hirer The vehicle owner.
 * @apiSuccess {String} vehicle The vehicle being hired.
 * @apiSuccess {String} booked_by The user account respomsible for booking the vehicle (vehicle hire).
 * @apiSuccess {String} booking_updated_by The user account responsible for changes to the vehicle hire record.
 * @apiSuccess {String} created_at VehicleHire creation date/time.
 * @apiSuccess {String} updated_at VehicleHire update date/time.
 * @apiSuccess {String} deleted_at VehicleHire deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "release": {
 *                                  "date": "2023-07-01",
 *                                  "time": "10:59"
 *                             },
 *                  "due_back": {
 *                                  "date": "2023-07-01",
 *                                  "time": "10:59"
 *                             },
 *                  "return": "2023-07-01T10:59:17.117+00:00",
 *                  "vehicle_hire_rate_due_in_figures": "20.00",
 *                  "vehicle_hire_rate_due_currency": "USD",
 *                  "paid": "false",
 *                  "vehicle_hire_charge_timing": "seconds",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "booked_by": "641998f45d6408b13cb229b0",
 *                  "booking_updated_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00",
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no vehicleHires found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No vehicle hires found"
 *     }
 */
const getAllVehicleHires = async (req, res) => {
    const vehicleHires = await VehicleHire.find().sort('-created_at').lean();
    if (!vehicleHires?.length) return res.status(404).json({ message: "No vehicle hires found" });

    res.status(200).json({ data: vehicleHires });
};

/**
 * @apiGroup VehicleHires
 * @apiPermission auth
 * @api {get} /api/v1/vehicle-hires/:vehicle-hire 01. Get a Vehicle Hire Record
 * @apiName GetVehicleHire
 * 
 * @apiParam {String} vehicle-hire Vehicle hire's ID.
 * 
 * @apiDescription This retrieve a vehicle hire record.
 *
 * @apiSuccess {String} _id Vehicle Hire ID.
 * @apiSuccess {Object} release Vehicle release date/time.
 * @apiSuccess {String} release.date Vehicle release date.
 * @apiSuccess {String} release.time Vehicle release time.
 * @apiSuccess {Object} due_back Vehicle due back date/time.
 * @apiSuccess {String} due_back.date Vehicle due back date.
 * @apiSuccess {String} due_back.time Vehicle due back time.
 * @apiSuccess {Object} return Vehicle return date/time.
 * @apiSuccess {String} return.date Vehicle return date.
 * @apiSuccess {String} return.time Vehicle return time.
 * @apiSuccess {String} vehicle_hire_rate_due_in_figures Vehicle hire rate (cost).
 * @apiSuccess {String} vehicle_hire_rate_due_currency Vehicle hire rate currency (enum: ['USD', 'Euro', 'British Pound']).
 * @apiSuccess {Boolean} paid Vehicle hire paid for/not.
 * @apiSuccess {String} vehicle_hire_charge_timing Vehicle hire charge timing (enum: ['minutes', 'seconds', 'hourly', 'days']).
 * @apiSuccess {String} hiree The user who is hiring the vehicle from the owner.
 * @apiSuccess {String} hirer The vehicle owner.
 * @apiSuccess {String} vehicle The vehicle being hired.
 * @apiSuccess {String} booked_by The user account respomsible for booking the vehicle (vehicle hire).
 * @apiSuccess {String} booking_updated_by The user account responsible for changes to the vehicle hire record.
 * @apiSuccess {String} created_at VehicleHire creation date/time.
 * @apiSuccess {String} updated_at VehicleHire update date/time.
 * @apiSuccess {String} deleted_at VehicleHire deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "release": {
 *                                  "date": "2023-07-01",
 *                                  "time": "10:59"
 *                             },
 *                  "due_back": {
 *                                  "date": "2023-07-01",
 *                                  "time": "10:59"
 *                             },
 *                  "return": "2023-07-01T10:59:17.117+00:00",
 *                  "vehicle_hire_rate_due_in_figures": "20.00",
 *                  "vehicle_hire_rate_due_currency": "USD",
 *                  "paid": "false",
 *                  "vehicle_hire_charge_timing": "seconds",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "booked_by": "641998f45d6408b13cb229b0",
 *                  "booking_updated_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *               }
 *     }
 * 
 * @apiError NotFound Possible error message if no vehicleHires found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Parameter validation failed",
 *       "details": "..."
 *     }
 * 
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "Found no vehicle hire matches with 641998f45d6408b13cb229b0"
 *     }
 */
const getVehicleHire = async (req, res) => {
    if (!req?.params?.hire) return res.status(400).json({ message: "ID required" });

    let validatedData;
    try {
        validatedData = await getVehicleHireSchema.validateAsync({ hire: req.params.hire })
    } catch (error) {
        return res.status(400).json({ message: "Parameter validation failed", details: `${error}` });
    }
    
    const vehicleHire = await VehicleHire.findOne({ _id: validatedData.hire });
    if (!vehicleHire) {
        return res.status(404).json({ message: `Found no vehicle hire matches with ${validatedData.hire}` });
    }
    res.status(200).json({ data: vehicleHire });
}

/**
 * @apiGroup VehicleHires
 * @apiPermission auth
 * @api {post} /api/v1/vehicle-hires 02. Create New Vehicle Hire Record
 * @apiName CreateNewVehicleHire
 * 
 * @apiDescription This creates a new vehicle hire record.
 * 
 * @apiBody {String} vehicle     Vehicle being hired/booked.
 * @apiBody {String} hiree       The user who intends to hire the vehicle.
 * @apiBody {String} hirer       The owner of the vehicle who intends to put up their vehicle for hire.
 * @apiBody {String} release_date       The release (hire) date of the vehicle.
 * @apiBody {String} release_time       The release (hire) time of the vehicle.
 * @apiBody {String} due_back_date       The proposed due back (hire stop) date of the vehicle.
 * @apiBody {String} due_back_time       The proposed due back (hire stop) time of the vehicle.
 * @apiBody {String} vehicle_hire_charge_timing       Vehicle hire charge timing.
 * @apiExample {json} Request Body:
 *     {
 *       "vehicle": "641998f45d6408b13cb229b0",
 *       "hiree": "641998f45d6408b13cb229b0",
 *       "hirer": "641998f45d6408b13cb229b0",
 *       "release_date": "2023-07-01",
 *       "release_time": "10:59",
 *       "due_back_date": "2023-07-01",
 *       "due_back_time": "10:59",
 *       "vehicle_hire_charge_timing": "seconds"
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 UserCreated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "release": {
 *                                  "date": "2023-07-01",
 *                                  "time": "10:59"
 *                             },
 *                  "due_back": {
 *                                  "date": "2023-07-01",
 *                                  "time": "10:59"
 *                             },
 *                  "return": "2023-07-01T10:59:17.117+00:00",
 *                  "vehicle_hire_rate_due_in_figures": "20.00",
 *                  "vehicle_hire_rate_due_currency": "USD",
 *                  "paid": "false",
 *                  "vehicle_hire_charge_timing": "seconds",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "booked_by": "641998f45d6408b13cb229b0",
 *                  "booking_updated_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "Vehicle ... hire successful. You may choose to pay at once or pay on delivery"
 *     }
 * 
 * @apiError CreateVehicleHireErrors Possible error messages.
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
 */
const createVehicleHire = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createVehicleHireSchema.validateAsync({ vehicle: req.body.vehicle, 
                                                                    hiree: req.body.hiree,
                                                                    hirer: req.body.hirer, 
                                                                    release_date: req.body.release_date, 
                                                                    release_time: req.body.release_time, 
                                                                    due_back_date: req.body.due_back_date, 
                                                                    due_back_time: req.body.due_back_time,
                                                                    vehicle_hire_charge_timing: req.body.vehicle_hire_charge_timing });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleHire = new VehicleHire({
        vehicle: validatedData.vehicle,
        hiree: validatedData.hiree,
        hirer: validatedData.hirer,
        release: {
            date: validatedData.release_date,
            time: validatedData.release_time
        },
        due_back: {
            date: validatedData.due_back_date,
            time: validatedData.due_back_time
        },
        vehicle_hire_charge_timing: validatedData.vehicle_hire_charge_timing,
        booked_by: req.user_id,
        updated_by: req.user_id
    });

    const vehicle = await Vehicle.findOne({ _id: vehicleHire.vehicle}).exec();
    const vehicleUnit = `${vehicle.vehicle_brand} ${vehicle.vehicle_model} - plate number ${vehicle.vehicle_plate_number}`

    vehicleHire.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` })
        }
        res.status(201).json({ data: `${vehicleHire}`, success: `Vehicle ${vehicleUnit} hire successful. You may choose to pay at once or pay on delivery` });
    });
};

// const updateVehicleHire = async (req, res) => {

//     let validatedData;
//     try {
//         validatedData = await updateVehicleHireSchema.validateAsync({ hire: req.params.hire, 
//                                                                     vehicle: req.body.vehicle, 
//                                                                     hiree: req.body.hiree,
//                                                                     hirer: req.body.hirer, 
//                                                                     release_date: req.body.release_date, 
//                                                                     release_time: req.body.release_time, 
//                                                                     due_back_date: req.body.due_back_date, 
//                                                                     due_back_time: req.body.due_back_time, 
//                                                                     return_date: req.body.return_date, 
//                                                                     return_time: req.body.return_time, 
//                                                                     vehicle_hire_charge_timing: req.body.vehicle_hire_charge_timing });
//     } catch (error) {
//         return res.status(400).json({ message: "Validation failed", details: `${error}` });
//     }

//     const ifAuthenticatedUser = await User.findOne({ _id: req.user_id }).lean();

//     if (ifAuthenticatedUser._id != req.user_id) {
//         return res.status(403).json({ message: "You do not have permission to update posts that do not belong to you" });

//     } else if (ifAuthenticatedUser._id == req.user_id) {

//         const vehicleHireFound = await VehicleHire.findOne({ _id: validatedData.hire }).exec();
//         if (!vehicleHireFound) return res.status(404).json({ message: "No records found of the requested vehicle hire" });

//         if (validatedData.vehicle) vehicleHireFound.vehicle = validatedData.vehicle;
//         if (validatedData.hiree) vehicleHireFound.hiree = validatedData.hiree;
//         if (validatedData.hirer) vehicleHireFound.hirer = validatedData.hirer;
//         if (validatedData.release_date) vehicleHireFound.release.date = validatedData.release_date;
//         if (validatedData.release_time) vehicleHireFound.release.time = validatedData.release_time;
//         if (validatedData.due_back_date) vehicleHireFound.due_back.date = validatedData.due_back_date;
//         if (validatedData.due_back_time) vehicleHireFound.due_back.time = validatedData.due_back_time;
//         if (validatedData.return_date) vehicleHireFound.return.date = validatedData.return_date;
//         if (validatedData.return_time) vehicleHireFound.return.time = validatedData.return_time;
//         if (validatedData.vehicle_hire_charge_timing) vehicleHireFound.vehicle_hire_charge_timing = validatedData.vehicle_hire_charge_timing;
//         if (validatedData.booking_updated_by) vehicleHireFound.booking_updated_by = req.user_id;

//         const vehicle = await Vehicle.findOne({ _id: vehicleHireFound.vehicle}).lean();

//         vehicleHireFound.save((error) => {
//             if (error) {
//                 return res.status(400).json({ message: "An error occured", details: `${error}` });
//             }
//             res.status(201).json({ success: `Vehicle ${vehicle.vehicle_brand} ${vehicle.vehicle_model} with plate number ${vehicle.vehicle_plate_number} hire update successful`, data: vehicleHireFound });
//         });
//     };
// }

/**
 * @apiGroup VehicleHires
 * @apiPermission auth, admin
 * @api {patch} /api/v1/vehicle-hires/:id 03. Update Vehicle Hire
 * @apiName UpdateVehicleHire
 * 
 * @apiParam {String} id Vehicle Hire's ID.
 * 
 * @apiDescription This updates an existing vehicle hire record.
 * 
 * @apiBody {String} vehicle     Vehicle being hired/booked.
 * @apiBody {String} hiree       The user who intends to hire the vehicle.
 * @apiBody {String} hirer       The owner of the vehicle who intends to put up their vehicle for hire.
 * @apiBody {String} release_date       The release (hire) date of the vehicle.
 * @apiBody {String} release_time       The release (hire) time of the vehicle.
 * @apiBody {String} due_back_date       The proposed due back (hire stop) date of the vehicle.
 * @apiBody {String} due_back_time       The proposed due back (hire stop) time of the vehicle.
 * @apiBody {String} vehicle_hire_charge_timing       Vehicle hire charge timing.
 * @apiBody {String} booked_by       The user who booked (paid for) the vehicle hire.
 * @apiBody {String} booking_updated_by       The admin who updated the vehicle hire record.
 * @apiBody {Boolean} paid       Payment status for the vehicle hire record.
 * @apiExample {json} Request Body:
 *     {
 *       "vehicle": "641998f45d6408b13cb229b0",
 *       "hiree": "641998f45d6408b13cb229b0",
 *       "hirer": "641998f45d6408b13cb229b0",
 *       "release_date": "2023-07-01",
 *       "release_time": "10:59",
 *       "due_back_date": "2023-07-01",
 *       "due_back_time": "10:59",
 *       "return": "2023-07-01T10:59:17.117+00:00",
 *       "vehicle_hire_charge_timing": "seconds",
 *       "booked_by": "641998f45d6408b13cb229b0",
 *       "booking_updated_by": "641998f45d6408b13cb229b0",
 *       "paid": "false",
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 UserUpdated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "release": {
 *                                  "date": "2023-07-01",
 *                                  "time": "10:59"
 *                             },
 *                  "due_back": {
 *                                  "date": "2023-07-01",
 *                                  "time": "10:59"
 *                             },
 *                  "return": "2023-07-01T10:59:17.117+00:00",
 *                  "vehicle_hire_rate_due_in_figures": "20.00",
 *                  "vehicle_hire_rate_due_currency": "USD",
 *                  "paid": "false",
 *                  "vehicle_hire_charge_timing": "seconds",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "booked_by": "641998f45d6408b13cb229b0",
 *                  "booking_updated_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "Vehicle Mercedes Benz S-600 with plate number Abc123DEF56789 hire update successful"
 *     }
 * 
 * @apiError VehicleHireUpdateErrors Possible error messages.
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
 *     HTTP/1.1 404 VehicleHireNotFound
 *     {
 *       "message": "No records found of the requested vehicle hire"
 *     }
 */
const updateVehicleHireAdminLevel = async (req, res) => {
    let validatedData;
    try {
        validatedData = await updateVehicleHireSchema.validateAsync({ id: req.params.id, 
                                                                    vehicle: req.body.vehicle, 
                                                                    hiree: req.body.hiree,
                                                                    hirer: req.body.hirer, 
                                                                    release_date: req.body.release_date, 
                                                                    release_time: req.body.release_time, 
                                                                    due_back_date: req.body.due_back_date, 
                                                                    due_back_time: req.body.due_back_time, 
                                                                    return: req.body.return,
                                                                    vehicle_hire_charge_timing: req.body.vehicle_hire_charge_timing, 
                                                                    booked_by: req.body.booked_by, 
                                                                    booking_updated_by: req.body.booking_updated_by, 
                                                                    paid: req.body.paid });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleHireFound = await VehicleHire.findOne({ _id: validatedData.id }).exec();
    if (!vehicleHireFound) return res.status(404).json({ message: "No records found of the requested vehicle hire" });

    if (validatedData.vehicle) vehicleHireFound.vehicle = validatedData.vehicle;
    if (validatedData.hiree) vehicleHireFound.hiree = validatedData.hiree;
    if (validatedData.hirer) vehicleHireFound.hirer = validatedData.hirer;
    if (validatedData.release_date) vehicleHireFound.release.date = validatedData.release_date;
    if (validatedData.release_time) vehicleHireFound.release.time = validatedData.release_time;
    if (validatedData.due_back_date) vehicleHireFound.due_back.date = validatedData.due_back_date;
    if (validatedData.due_back_time) vehicleHireFound.due_back.time = validatedData.due_back_time;
    if (validatedData.return) vehicleHireFound.return = validatedData.return;
    if (validatedData.vehicle_hire_charge_timing) vehicleHireFound.vehicle_hire_charge_timing = validatedData.vehicle_hire_charge_timing;
    if (validatedData.booked_by) vehicleHireFound.booked_by = validatedData.booked_by;
    if (validatedData.booking_updated_by) vehicleHireFound.booking_updated_by = validatedData.booking_updated_by;
    if (validatedData.paid) vehicleHireFound.paid = validatedData.paid;

    const vehicle = await Vehicle.findOne({ _id: vehicleHireFound.vehicle}).lean();

    vehicleHireFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ success: `Vehicle ${vehicle.vehicle_brand} ${vehicle.vehicle_model} with plate number ${vehicle.vehicle_plate_number} hire update successful`, data: vehicleHireFound });
    });
}

const startHire = async (req, res) => {

}

/**
 * @apiGroup VehicleHires
 * @apiPermission auth
 * @api {put} /api/v1/vehicle-hires/:vehicle-hire 04. Stop Vehicle Hire
 * @apiName StopVehicleHire
 * 
 * @apiParam {String} vehicle-hire Vehicle Hire's ID.
 * 
 * @apiDescription This stops a running (currently actives) vehicle hire.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 UserUpdated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "release": {
 *                                  "date": "2023-07-01",
 *                                  "time": "10:59"
 *                             },
 *                  "due_back": {
 *                                  "date": "2023-07-01",
 *                                  "time": "10:59"
 *                             },
 *                  "return": "2023-07-01T10:59:17.117+00:00",
 *                  "vehicle_hire_rate_due_in_figures": "20.00",
 *                  "vehicle_hire_rate_due_currency": "USD",
 *                  "paid": "false",
 *                  "vehicle_hire_charge_timing": "seconds",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "booked_by": "641998f45d6408b13cb229b0",
 *                  "booking_updated_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "Vehicle Mercedes Benz S-600 with plate number ABC123DEF4567 hire stopped"
 *     }
 * 
 * @apiError VehicleHireUpdateErrors Possible error messages.
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
 *     HTTP/1.1 404 VehicleHireNotFound
 *     {
 *       "message": "No records found of the requested vehicle hire"
 *     }
 * 
 *     HTTP/1.1 409 VehicleHireLreadyStopped
 *     {
 *       "message": "Vehicle hire already stopped"
 *     }
 */
const stopVehicleHire = async (req, res) => {
    let validatedData;
    try {
        validatedData = await updateVehicleHireSchema.validateAsync({ hire: req.params.hire });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const ifAuthenticatedUser = await User.findOne({ _id: req.user_id }).lean();

    if (ifAuthenticatedUser._id != req.user_id) {
        return res.status(403).json({ message: "You do not have permission to process this request" });

    } else if (ifAuthenticatedUser._id == req.user_id) {

        const vehicleHireFound = await VehicleHire.findOne({ _id: validatedData.hire }).exec();
        if (!vehicleHireFound) return res.status(404).json({ message: "No records found of the requested vehicle hire" });

        if (vehicleHireFound.return) return res.status(409).json({ message: "Vehicle hire already stopped"})

        vehicleHireFound.return = new Date().toISOString();
        vehicleHireFound.booking_updated_by = req.user_id;

        const vehicle = await Vehicle.findOne({ _id: vehicleHireFound.vehicle}).lean();

        vehicleHireFound.save((error) => {
            if (error) {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }
            res.status(201).json({ success: `Vehicle ${vehicle.vehicle_brand} ${vehicle.vehicle_model} with plate number ${vehicle.vehicle_plate_number} hire stopped`, data: vehicleHireFound });
        });
    };
}

/**
 * @apiGroup VehicleHires
 * @apiPermission auth
 * @api {patch} /api/v1/vehicle-hires/:vehicle-hire 05. Soft-Delete Vehicle (User deletes vehicle hire record)
 * @apiName SoftDeleteVehicle
 * 
 * @apiParam {String} vehicle-hire Vehicle's ID.
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
const softDeleteVehicleHire = async (req, res) => {
    // Consider using this method for your delete (for users) instead of the "deleteVehicle" method below

    let validatedData;
    try {
        validatedData = await getVehicleHireSchema.validateAsync({ hire: req.params.hire });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleHireFound = await VehicleHire.findOne({ _id: validatedData.hire }).exec();
    if (!vehicleHireFound) return res.status(404).json({ message: "Vehicle Hire record not found" });

    if (vehicleHireFound.active == true) {
        vehicleHireFound.active = false;
        vehicleHireFound.deleted_at = new Date().toISOString();
    }

    vehicleHireFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({message: `Vehicle hire record ${vehicleHireFound._id} inactivated / deleted` });
    });
}

/**
 * @apiGroup VehicleHires
 * @apiPermission auth, admin
 * @api {patch} /api/v1/vehicle-hires/:vehicle-hire/re-activate 06. Re-activate Soft-Deleted Vehicle Hire Record
 * @apiName ReactivateSoftDeletedVehicleHire
 * 
 * @apiParam {String} vehicle-hire Vehicle Hire's ID.
 * 
 * @apiDescription This allows soft-deleted vehicle hire record to be re-activated.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 VehicleHireReactivated
 *     {
 *       "data": {
 *                  "_id": "641998f45d6408b13cb229b0",
 *                  "release": {
 *                                  "date": "2023-07-01",
 *                                  "time": "10:59"
 *                             },
 *                  "due_back": {
 *                                  "date": "2023-07-01",
 *                                  "time": "10:59"
 *                             },
 *                  "return": "2023-07-01T10:59:17.117+00:00",
 *                  "vehicle_hire_rate_due_in_figures": "20.00",
 *                  "vehicle_hire_rate_due_currency": "USD",
 *                  "paid": "false",
 *                  "vehicle_hire_charge_timing": "seconds",
 *                  "hiree": "641998f45d6408b13cb229b0",
 *                  "hirer": "641998f45d6408b13cb229b0",
 *                  "vehicle": "641998f45d6408b13cb229b0",
 *                  "booked_by": "641998f45d6408b13cb229b0",
 *                  "booking_updated_by": "641998f45d6408b13cb229b0",
 *                  "created_at": "2023-07-01T10:59:17.117+00:00",
 *                  "updated_at": "2023-07-01T10:59:17.117+00:00",
 *                  "deleted_at": "2023-07-01T10:59:17.117+00:00"
 *                },
 *       "success": "Vehicle hire 641998f45d6408b13cb229b0 reactivated"
 *     }
 * 
 * @apiError VehicleHireSoftDeleteErrors Possible error messages.
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
 *     HTTP/1.1 404 VehicleHireNotFound
 *     {
 *       "message": "Vehicle hire record not found"
 *     }
 */
const reactivateSoftDeletedVehicleHire = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getVehicleHireSchema.validateAsync({ hire: req.body.hire });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleHireFound = await VehicleHire.findOne({ _id: validatedData.hire }).exec();
    if (!vehicleHireFound) return res.status(404).json({ message: "Vehicle hire record not found" });

    if (vehicleHireFound.active == false) {
        vehicleHireFound.active = true;
        vehicleHireFound.deleted_at = '';
    }

    vehicleHireFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ success: `Vehicle hire ${vehicleHireFound._id} reactivated`, data: vehicleHireFound });
    });
}

/**
 * @apiGroup VehicleHires
 * @apiPermission auth, admin
 * @api {delete} /api/v1/vehicle-hires/:id 07. Delete Vehicle Hire (Permanently)
 * @apiName DeleteVehicleHire
 * 
 * @apiParam {String} id Vehicle Hire's ID.
 * 
 * @apiDescription This allows for permanent deletion of vehicle hire record by admin.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 Deleted
 *     {
 *       "data": {
 *                  "vehicle_hire_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "Vehicle hire record 641998f45d6408b13cb229b0 has been permanently deleted"
 *     }
 * 
 * @apiError VehicleHireDeleteErrors Possible error messages.
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
 *     HTTP/1.1 404 VehicleHireNotFound
 *     {
 *       "message": "No vehicle hire record matches the vehicle hire 641998f45d6408b13cb229b0"
 *     }
 */
const deleteVehicleHire = async (req, res) => {
    // Consider not implementing this route on the client side. Rather, it is strongly recommended to use the "softDeleteVehicle" method above. 

    let validatedData;
    try {
        validatedData = await getVehicleHireSchema.validateAsync({ hire: req.params.hire })
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleHire = await VehicleHire.findOne({ _id: validatedData.hire }).exec();
    if (!vehicleHire) {
        return res.status(404).json({ message: `No vehicleHire matches the vehicleHire ${validatedData.hire}` });
    }

    const deletedVehicleHire = await vehicleHire.deleteOne();

    res.status(200).json({ success: `Vehicle hire record ${deletedVehicleHire} has been permanently deleted`, data: `${deletedVehicleHire._id}` })
}


module.exports = {
    getAllVehicleHires,
    getVehicleHire,
    createVehicleHire,
    // updateVehicleHire,
    updateVehicleHireAdminLevel, 
    startHire, 
    stopVehicleHire, 
    softDeleteVehicleHire,
    reactivateSoftDeletedVehicleHire,
    deleteVehicleHire
}