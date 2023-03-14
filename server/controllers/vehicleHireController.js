const Vehicle = require('../models/Vehicle');
const VehicleHire = require('../models/VehicleHire');
const createVehicleHireSchema = require('../requestValidators/vehicleHires/createVehicleHireValidator');
const updateVehicleHireSchema = require('../requestValidators/vehicleHires/updateVehicleHireValidator');


const getAllVehicleHires = async (req, res) => {
    const vehicleHires = await VehicleHire.find().sort('-created_at').lean();
    if (!vehicleHires?.length) return res.status(404).json({ message: "No vehicle hires found" });

    res.json(vehicleHires);
};

const getVehicleHire = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ message: "ID required" });

    let validatedData;
    try {
        validatedData = await getVehicleHireSchema.validateAsync({ id: req.params.id })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }
    
    const vehicleHire = await VehicleHire.findOne({ _id: validatedData.id });
    if (!user) {
        return res.status(404).json({ message: `No vehicle hire matches with ${validatedData.id} found` });
    }
    res.status(200).json(vehicleHire);
}

const createVehicleHire = async (req, res) => {
    let validatedData;
    try {
        validatedData = await createVehicleHireSchema.validateAsync({ vehicle: req.body.vehicle, 
                                                                    user_hiring: req.body.user_hiring,
                                                                    user_renting: req.body.user_renting, 
                                                                    release_date: req.body.release_date, 
                                                                    release_time: req.body.release_time, 
                                                                    due_back_date: req.body.due_back_date, 
                                                                    due_back_time: req.body.due_back_time, 
                                                                    return_date: req.body.return_date, 
                                                                    return_time: req.body.return_time, 
                                                                    validUser: req.user._id });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleHire = new VehicleHire({
        vehicle: validatedData.vehicle,
        user_hiring: validatedData.user_hiring,
        user_renting: validatedData.user_renting,
        release: {
            date: validatedData.release_date,
            time: validatedData.release_time
        },
        due_back: {
            date: validatedData.due_back_date,
            time: validatedData.due_back_time
        },
        return: {
            date: validatedData.return_date,
            time: validatedData.return_time
        },
        created_by: validatedData.validUser
    });

    const vehicle = await Vehicle.findOne({ _id: vehicleHire.vehicle}).exec();
    const vehicleUnit = `${vehicle.vehicle_brand} ${vehicle.vehicle_model} - plate number ${vehicle.vehicle_plate_number}`

    vehicleHire.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` })
        }
        res.status(201).json({ message: `Vehicle ${vehicleUnit} hire successful. You may choose to pay at once or pay on delivery` });
    })
}

const updateVehicleHire = async (req, res) => {
    let validatedData;
    try {
        validatedData = await updateVehicleHireSchema.validateAsync({ vehicle: req.body.vehicle, 
                                                                    user_hiring: req.body.user_hiring, 
                                                                    user_renting: req.body.user_renting, 
                                                                    release_date: req.body.release_date, 
                                                                    release_time: req.body.release_time, 
                                                                    due_back_date: req.body.due_back_date, 
                                                                    due_back_time: req.body.due_back_time, 
                                                                    return_date: req.body.return_date, 
                                                                    return_time: req.body.return_time });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleHireFound = await VehicleHire.findOne({ _id: validatedData.id }).exec();
    if (!vehicleHireFound) return res.status(404).json({ message: "No records found of the requested vehicle hire" });

    if (validatedData.vehicle) vehicleHireFound.vehicle = validatedData.vehicle;
    if (validatedData.user_hiring) vehicleHireFound.user_hiring = validatedData.user_hiring;
    if (validatedData.user_renting) vehicleHireFound.user_renting = validatedData.user_renting;
    if (validatedData.release_date) vehicleHireFound.release.date = validatedData.release_date;
    if (validatedData.release_time) vehicleHireFound.release.time = validatedData.release_time;
    if (validatedData.due_back_date) vehicleHireFound.due_back.date = validatedData.due_back_date;
    if (validatedData.due_back_time) vehicleHireFound.due_back.time = validatedData.due_back_time;
    if (validatedData.return_date) vehicleHireFound.return.date = validatedData.return_date;
    if (validatedData.return_time) vehicleHireFound.return.time = validatedData.return_time;

    const vehicle = await Vehicle.findOne({ _id: vehicleHireFound.vehicle}).exec();

    vehicleHireFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ message: `Vehicle ${vehicle.vehicle_brand} ${vehicle.vehicle_model} with plate number ${vehicle.vehicle_plate_number} hire update successful` });
    });
}

const updateVehicleHireAdminLevel = async (req, res) => {
    let validatedData;
    try {
        validatedData = await updateVehicleHireSchema.validateAsync({ vehicle: req.body.vehicle, 
                                                                    user_hiring: req.body.user_hiring, 
                                                                    user_renting: req.body.user_renting, 
                                                                    release_date: req.body.release_date, 
                                                                    release_time: req.body.release_time, 
                                                                    due_back_date: req.body.due_back_date, 
                                                                    due_back_time: req.body.due_back_time, 
                                                                    return_date: req.body.return_date, 
                                                                    return_time: req.body.return_time });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleHireFound = await VehicleHire.findOne({ _id: validatedData.id }).exec();
    if (!vehicleHireFound) return res.status(404).json({ message: "No records found of the requested vehicle hire" });

    if (validatedData.vehicle) vehicleHireFound.vehicle = validatedData.vehicle;
    if (validatedData.user_hiring) vehicleHireFound.user_hiring = validatedData.user_hiring;
    if (validatedData.user_renting) vehicleHireFound.user_renting = validatedData.user_renting;
    if (validatedData.release_date) vehicleHireFound.release.date = validatedData.release_date;
    if (validatedData.release_time) vehicleHireFound.release.time = validatedData.release_time;
    if (validatedData.due_back_date) vehicleHireFound.due_back.date = validatedData.due_back_date;
    if (validatedData.due_back_time) vehicleHireFound.due_back.time = validatedData.due_back_time;
    if (validatedData.return_date) vehicleHireFound.return.date = validatedData.return_date;
    if (validatedData.return_time) vehicleHireFound.return.time = validatedData.return_time;

    const vehicle = await Vehicle.findOne({ _id: vehicleHireFound.vehicle}).exec();

    vehicleHireFound.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ message: `Vehicle ${vehicle.vehicle_brand} ${vehicle.vehicle_model} with plate number ${vehicle.vehicle_plate_number} hire update successful` });
    });
}

const softDeleteVehicleHire = async (req, res) => {
    // Consider using this method for your delete instead of the "deleteVehicle" method below

    let validatedData;
    try {
        validatedData = await softDeleteVehicleHireSchema.validateAsync({ _id: req.body.id });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleHireFound = await VehicleHire.findOne({ _id: validatedData.id }).exec();
    if (!vehicleHireFound) return res.status(404).json({ message: "Vehiclehire not found" });

    if (validatedData.active) vehicleHireFound.active = false;

    vehicleHireFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `Vehicle hire record ${vehicleHireFound._id} inactivated / deleted` });
    });
}

const reactivateSoftDeletedVehicleHire = async (req, res) => {

    let validatedData;
    try {
        validatedData = await reactivateSoftDeletedVehicleHireSchema.validateAsync({ id: req.body.id });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleHireFound = await VehicleHire.findOne({ _id: validatedData.id }).exec();
    if (!vehicleHireFound) return res.status(404).json({ message: "Vehicle hire not found" });

    if (validatedData.active) vehicleHireFound.active = true;

    vehicleHireFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `Vehicle hire ${vehicleHireFound._id} reactivated` });
    });
}

const deleteVehicleHire = async (req, res) => {
    // Consider not implementing this route on the client side. Rather, it is strongly recommended to use the "softDeleteVehicle" method above. 

    let validatedData;
    try {
        validatedData = await deleteVehicleHireSchema.validateAsync({ _id: req.params.id })
    } catch (error) {
        return res.status(400).json({ message: "User search term validation failed", details: `${error}` });
    }

    const vehicleHire = await VehicleHire.findOne({ _id: validatedData.id }).exec();
    if (!vehicleHire) {
        return res.status(404).json({ message: `No vehicleHire matches the vehicleHire ${validatedData.id}` });
    }

    const deletedVehicleHire = await vehicleHire.deleteOne();

    res.status(200).json({message: `Vehicle hire record ${deletedVehicleHire} has been permanently deleted` })
}


module.exports = {
    getAllVehicleHires,
    getVehicleHire,
    createVehicleHire,
    updateVehicleHire,
    updateVehicleHireAdminLevel,
    softDeleteVehicleHire,
    reactivateSoftDeletedVehicleHire,
    deleteVehicleHire
}