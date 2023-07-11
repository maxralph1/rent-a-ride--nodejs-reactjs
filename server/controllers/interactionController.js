const Interaction = require('../models/Interaction');
const getInteractionSchema = require('../requestValidators/interactions/getInteractionValidator');
const createInteractionSchema = require('../requestValidators/interactions/createInteractionValidator');


/**
 * @apiGroup Interactions
 * @apiPermission auth, admin
 * @api {get} /api/v1/interactions/vehicles/:vehicle    00. Get All Interactions (chats) pertaining to a vehicle
 * @apiName GetVehicleInteractions
 * 
 * @apiParam {String} vehicle Vehicle's ID.
 * 
 * @apiDescription This retrieves all interactions pertaining to a vehicle.
 *
 * @apiSuccess {String} _id Interaction ID.
 * @apiSuccess {String} message Interaction (chat) message.
 * @apiSuccess {String} for_vehicle The vehicle being talked about.
 * @apiSuccess {String} for_vehicle_hire The vehicle hire record being talked about.
 * @apiSuccess {String} added_by Author of the interaction.
 * @apiSuccess {String} created_at Interaction creation date/time.
 * @apiSuccess {String} updated_at Interaction update date/time.
 * @apiSuccess {String} deleted_at Interaction deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
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
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no interaction records found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Interactions found"
 *     }
 */
const getInteractionByVehicle = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ vehicle: req.params.vehicle, 
                                                                    user: req.params.user });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactions = await Interaction.find({ for_vehicle: validatedData.vehicle, added_by: req.params.user }).sort('-created_at').lean();
    if (!interactions?.length) return res.status(404).json({ message: "No interactions found" });

    res.json({ data: interactions });
};

/**
 * @apiGroup Interactions
 * @apiPermission auth
 * @api {get} /api/v1/interactions/vehicles/:vehicle/auth 01. Get All Currently Authenticated User's Interactions (chats) pertaining to a vehicle
 * @apiName GetVehicleInteractionsByAuthUser
 * 
 * @apiParam {String} vehicle Vehicle's ID.
 * 
 * @apiDescription This retrieves all interactions pertaining to a vehicle and the currently authenticated user.
 * 
 * @apiBody {String} added_by       Currently authenticated user.
 * @apiExample {json} Request Body:
 *     {
 *        "added_by": "641998f45d6408b13cb229b0"
 *     }
 *
 * @apiSuccess {String} _id Interaction ID.
 * @apiSuccess {String} message Interaction (chat) message.
 * @apiSuccess {String} for_vehicle The vehicle being talked about.
 * @apiSuccess {String} for_vehicle_hire The vehicle hire record being talked about.
 * @apiSuccess {String} added_by Author (currently authenticated user) of the interaction.
 * @apiSuccess {String} created_at Interaction creation date/time.
 * @apiSuccess {String} updated_at Interaction update date/time.
 * @apiSuccess {String} deleted_at Interaction deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
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
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no interaction records found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Interactions found"
 *     }
 */
const getInteractionByVehicleAuth = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ vehicle: req.params.vehicle });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactions = await Interaction.find({ for_vehicle: validatedData.vehicle, added_by: req.user_id }).sort('-created_at').lean();
    if (!interactions?.length) return res.status(404).json({ message: "No interactions found" });

    res.json({ data: interactions });
};

/**
 * @apiGroup Interactions
 * @apiPermission auth, admin
 * @api {get} /api/v1/interactions/vehicle-hires/:hire      02. Get All Interactions (chats) pertaining to a Vehicle Hire Record
 * @apiName GetVehicleHireInteractions
 * 
 * @apiParam {String} hire Vehicle Hire's ID.
 * 
 * @apiDescription This retrieves all interactions pertaininhg to a vehicle hire record.
 *
 * @apiSuccess {String} _id Interaction ID.
 * @apiSuccess {String} message Interaction (chat) message.
 * @apiSuccess {String} for_vehicle The vehicle being talked about.
 * @apiSuccess {String} for_vehicle_hire The vehicle hire record being talked about.
 * @apiSuccess {String} added_by Author of the interaction.
 * @apiSuccess {String} created_at Interaction creation date/time.
 * @apiSuccess {String} updated_at Interaction update date/time.
 * @apiSuccess {String} deleted_at Interaction deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
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
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no interaction records found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed", 
 *       "details": ...
 *     }
 * 
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Interactions found"
 *     }
 */
const getInteractionByVehicleHire = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ hire: req.params.hire, 
                                                                    user: req.params.user });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactions = await Interaction.find({ for_vehicle_hire: validatedData.hire, added_by: req.params.user }).sort('-created_at').lean();
    if (!interactions?.length) return res.status(404).json({ message: "No interactions found" });

    res.json({ data: interactions });
};

/**
 * @apiGroup Interactions
 * @apiPermission auth
 * @api {get} /api/v1/interactions/vehicle-hires/:hire/auth     03. Get All Interactions (chats) pertaining to a Vehicle Hire Record and the currently Authenticated User.
 * @apiName GetVehicleHireInteractionsByAuthUser
 * 
 * @apiParam {String} hire Vehicle Hire's ID.
 * 
 * @apiDescription This retrieves all interactions pertaininhg to a vehicle hire record and the currently authenticated user.
 *
 * @apiSuccess {String} _id Interaction ID.
 * @apiSuccess {String} message Interaction (chat) message.
 * @apiSuccess {String} for_vehicle The vehicle being talked about.
 * @apiSuccess {String} for_vehicle_hire The vehicle hire record being talked about.
 * @apiSuccess {String} added_by Author of the interaction.
 * @apiSuccess {String} created_at Interaction creation date/time.
 * @apiSuccess {String} updated_at Interaction update date/time.
 * @apiSuccess {String} deleted_at Interaction deletion date/time.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
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
 *               }, ...
 *     }
 * 
 * @apiError NotFound Possible error message if no interaction records found.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 ValidationFailed
 *     {
 *       "message": "Validation failed", 
 *       "details": ...
 *     }
 * 
 *     HTTP/1.1 404 NotFound
 *     {
 *       "message": "No Interactions found"
 *     }
 */
const getInteractionByVehicleHireAuth = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ hire: req.params.hire });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactions = await Interaction.find({ for_vehicle_hire: validatedData.hire, added_by: req.user_id }).sort('-created_at').lean();
    if (!interactions?.length) return res.status(404).json({ message: "No interactions found" });

    res.json({ data: interactions });
};

/**
 * @apiGroup Interactions
 * @apiPermission auth
 * @api {post} /api/v1/interactions/vehicles/:vehicle 04. Create Interaction for Vehicle
 * @apiName CreateInteractionForVehicle
 * 
 * @apiParam {String} vehicle Vehicle's ID.
 * 
 * @apiDescription This creates a new interaction for a vehicle.
 * 
 * @apiBody {String} [for_vehicle]     The vehicle being discussed about.
 * @apiExample {json} Request Body:
 *     {
 *        "for_vehicle": "641998f45d6408b13cb229b0",
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 InteractionCreated
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
 *       "success": "Interaction 641998f45d6408b13cb229b0 added"
 *     }
 * 
 * @apiError CreateInteractionErrors Possible error messages.
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
const createInteractionForVehicle = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createInteractionSchema.validateAsync({ vehicle: req.params.vehicle, 
                                                                    message: req.body.message });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interaction = new Interaction({
        message: validatedData.message,
        for_vehicle: validatedData.vehicle,
        added_by: req.user_id
    });

    interaction.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ success: `Interaction ${interaction._id} added`, data: interaction });
    });
};

/**
 * @apiGroup Interactions
 * @apiPermission auth
 * @api {post} /api/v1/interactions/vehicle-hires/:vehicle-hire 05. Create Interaction for Vehicle Hire Record
 * @apiName CreateInteractionForVehicleHire
 * 
 * @apiParam {String} vehicle-hire Vehicle Hire's ID.
 * 
 * @apiDescription This creates a new interaction for a vehicle.
 * 
 * @apiBody {String} [for_vehicle_hire]       The vehicle hire record being discussed about.
 * @apiExample {json} Request Body:
 *     {
 *        "for_vehicle_hire": "641998f45d6408b13cb229b0",
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 InteractionCreated
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
 *       "success": "Interaction 641998f45d6408b13cb229b0 added"
 *     }
 * 
 * @apiError CreateInteractionErrors Possible error messages.
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
const createInteractionForVehicleHire = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createInteractionSchema.validateAsync({ vehicle: req.params.vehicle, 
                                                                    message: req.body.message });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interaction = new Interaction({
        message: validatedData.message,
        for_vehicle: validatedData.vehicle,
        added_by: req.user_id
    });

    interaction.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ success: `Interaction ${interaction._id} added`, data: interaction });
    });
};

/**
 * @apiGroup Interactions
 * @apiPermission auth
 * @api {put} /api/v1/interactions/:interaction 06. Update Interaction Record
 * @apiName UpdateInteraction
 * 
 * @apiParam {String} interaction       Interaction's ID.
 * 
 * @apiDescription This updates an existing interaction.
 * 
 * @apiBody {String} [message]       The message.
 * @apiExample {json} Request Body:
 *     {
 *        "message": "Wow! You got a cool ride.",
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 InteractionUpdated
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
 *       "success": "Interaction 641998f45d6408b13cb229b0 updated"
 *     }
 * 
 * @apiError UpdateInteractionErrors Possible error messages.
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
const updateInteraction = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createInteractionSchema.validateAsync({ interaction: req.params.interaction, 
                                                                    message: req.body.message });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactionFound = await Interaction.findOne({$or: [{for_vehicle: validatedData.interaction}, {for_vehicle_hire: validatedData.interaction}]}).sort('-created_at').lean();
    if (!interactionFound) return res.status(404).json({ message: "Interaction not found" });

    interactionFound.message = validatedData.message;

    interactionFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ success: `Interaction ${interactionFound._id} updated` });
    });
};

/**
 * @apiGroup Interactions
 * @apiPermission auth
 * @api {put} /api/v1/interactions/:interaction/delete 07. Soft-Delete Interaction
 * @apiName SoftDeleteInteraction
 * 
 * @apiParam {String} interaction       Interaction's ID.
 * 
 * @apiDescription This soft-deletes interaction (user uses this to delete interaction. They can never retrieve it again. But same deleted interaction record can be retrieved by admin.).
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 InteractionInactivated
 *     {
 *       "data": {
 *                  "interaction_id": "641998f45d6408b13cb229b0"
 *                },
 *       "success": "Interaction 641998f45d6408b13cb229b0 inactivated / deleted"
 *     }
 * 
 * @apiError InteractionSoftDeleteErrors Possible error messages.
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
 *     HTTP/1.1 404 InteractionNotFound
 *     {
 *       "message": "Interaction not found"
 *     }
 */
const softDeleteInteraction = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ interaction: req.params.interaction });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactionFound = await Interaction.findOne({ _id: validatedData.interaction, added_by: req.user_id }).exec();
    if (!interactionFound) return res.status(404).json({ message: "Interaction not found" });

    if (interactionFound.deleted_at == '') interactionFound.deleted_at = new Date().toISOString();

    interactionFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ success: `Interaction ${interactionFound._id} inactivated / deleted`, data: `${interactionFound._id}` });
    });
};

/**
 * @apiGroup Interactions
 * @apiPermission auth, admin
 * @api {put} /api/v1/interactions/:interaction/re-activate 08. Re-activate Soft-Deleted Interaction
 * @apiName ReactivateSoftDeletedInteraction
 * 
 * @apiParam {String} interaction       Interaction's ID.
 * 
 * @apiDescription This allows soft-deleted interaction record to be re-activated.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 InteractionReactivated
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
 *       "success": "Interaction 641998f45d6408b13cb229b0 reactivated"
 *     }
 * 
 * @apiError InteractionSoftDeleteErrors Possible error messages.
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
 *     HTTP/1.1 404 InteractionNotFound
 *     {
 *       "message": "Interaction not found"
 *     }
 */
const reactivateSoftDeletedInteraction = async (req, res) => {
    
    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ interaction: req.params.interaction });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactionFound = await Interaction.findOne({ _id: validatedData.interaction }).exec();
    if (!interactionFound) return res.status(404).json({ message: "Interaction not found" });

    if (interactionFound.deleted_at != '') interactionFound.deleted_at = '';

    interactionFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(200).json({ success: `Interaction ${interactionFound._id} reactivated`, data: `${interactionFound}` });
    });
};

/**
 * @apiGroup Interactions
 * @apiPermission auth, admin
 * @api {delete} /api/v1/interactions/:interaction 09. This Permanently Deletes an Interaction Record
 * @apiName DeleteInteraction
 * 
 * @apiParam {String} interaction       Interaction's ID.
 * 
 * @apiDescription This allows for permanent deletion of interaction record by admin.
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
 *       "success": "Interaction 641998f45d6408b13cb229b0 has been permanently deleted"
 *     }
 * 
 * @apiError InteractionDeleteErrors Possible error messages.
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
 *     HTTP/1.1 404 InteractionNotFound
 *     {
 *       "message": "No interaction matches the interaction 641998f45d6408b13cb229b0"
 *     }
 */
const deleteInteraction = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ interaction: req.params.interaction });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactionFound = await Interaction.findOne({ _id: validatedData.interaction }).exec();
    if (!interactionFound) {
        return res.status(404).json({ message: `No interaction matches the interaction ${validatedData.interaction}` });
    }

    const deletedInteraction = await interactionFound.deleteOne();

    res.status(200).json({ success: `Interaction location ${deletedInteraction._id} has been permanently deleted`, data: `${deletedInteraction}` })
};


module.exports = {
    getInteractionByVehicle, 
    getInteractionByVehicleAuth, 
    getInteractionByVehicleHire, 
    getInteractionByVehicleHireAuth, 
    createInteractionForVehicle, 
    createInteractionForVehicleHire, 
    updateInteraction, 
    softDeleteInteraction, 
    reactivateSoftDeletedInteraction, 
    deleteInteraction
}