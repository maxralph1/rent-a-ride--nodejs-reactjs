const VehicleHire = require('../models/VehicleHire');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const Payment = require('../models/Payment');
const getVehicleHireSchema = require('../requestValidators/vehicleHires/getVehicleHireValidator')
const createVehicleHireSchema = require('../requestValidators/vehicleHires/createVehicleHireValidator');
const updateVehicleHireSchema = require('../requestValidators/vehicleHires/updateVehicleHireValidator');


const getAllVehicleHires = async (req, res) => {
    const vehicleHires = await VehicleHire.find().sort('-created_at').lean();
    if (!vehicleHires?.length) return res.status(404).json({ message: "No vehicle hires found" });

    res.status(200).json({ data: vehicleHires });
};

const getVehicleHire = async (req, res) => {
    if (!req?.params?.hire) return res.status(400).json({ message: "ID required" });

    let validatedData;
    try {
        validatedData = await getVehicleHireSchema.validateAsync({ hire: req.params.hire })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }
    
    const vehicleHire = await VehicleHire.findOne({ _id: validatedData.hire });
    if (!vehicleHire) {
        return res.status(404).json({ message: `Found no vehicle hire matches with ${validatedData.hire}` });
    }
    res.status(200).json({ data: vehicleHire });
}

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
                                                                    return_date: req.body.return_date, 
                                                                    return_time: req.body.return_time, 
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
        return: {
            date: validatedData.return_date,
            time: validatedData.return_time
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
        res.status(201).json({ message: `Vehicle ${vehicleUnit} hire successful. You may choose to pay at once or pay on delivery` });
    });
};

const updateVehicleHire = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updateVehicleHireSchema.validateAsync({ hire: req.params.hire, 
                                                                    vehicle: req.body.vehicle, 
                                                                    hiree: req.body.hiree,
                                                                    hirer: req.body.hirer, 
                                                                    release_date: req.body.release_date, 
                                                                    release_time: req.body.release_time, 
                                                                    due_back_date: req.body.due_back_date, 
                                                                    due_back_time: req.body.due_back_time, 
                                                                    return_date: req.body.return_date, 
                                                                    return_time: req.body.return_time, 
                                                                    vehicle_hire_charge_timing: req.body.vehicle_hire_charge_timing });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const ifAuthenticatedUser = await User.findOne({ _id: req.user_id }).lean();

    if (ifAuthenticatedUser._id != req.user_id) {
        return res.status(403).json({ message: "You do not have permission to update posts that do not belong to you" });

    } else if (ifAuthenticatedUser._id == req.user_id) {

        const vehicleHireFound = await VehicleHire.findOne({ _id: validatedData.hire }).exec();
        if (!vehicleHireFound) return res.status(404).json({ message: "No records found of the requested vehicle hire" });

        if (validatedData.vehicle) vehicleHireFound.vehicle = validatedData.vehicle;
        if (validatedData.hiree) vehicleHireFound.hiree = validatedData.hiree;
        if (validatedData.hirer) vehicleHireFound.hirer = validatedData.hirer;
        if (validatedData.release_date) vehicleHireFound.release.date = validatedData.release_date;
        if (validatedData.release_time) vehicleHireFound.release.time = validatedData.release_time;
        if (validatedData.due_back_date) vehicleHireFound.due_back.date = validatedData.due_back_date;
        if (validatedData.due_back_time) vehicleHireFound.due_back.time = validatedData.due_back_time;
        if (validatedData.return_date) vehicleHireFound.return.date = validatedData.return_date;
        if (validatedData.return_time) vehicleHireFound.return.time = validatedData.return_time;
        if (validatedData.vehicle_hire_charge_timing) vehicleHireFound.vehicle_hire_charge_timing = validatedData.vehicle_hire_charge_timing;
        if (validatedData.booking_updated_by) vehicleHireFound.booking_updated_by = req.user_id;

        const vehicle = await Vehicle.findOne({ _id: vehicleHireFound.vehicle}).lean();

        vehicleHireFound.save((error) => {
            if (error) {
                return res.status(400).json({ message: "An error occured", details: `${error}` });
            }
            res.status(201).json({ success: `Vehicle ${vehicle.vehicle_brand} ${vehicle.vehicle_model} with plate number ${vehicle.vehicle_plate_number} hire update successful`, data: vehicleHireFound });
        });
    };
}

const updateVehicleHireAdminLevel = async (req, res) => {
    let validatedData;
    try {
        validatedData = await updateVehicleHireSchema.validateAsync({ hire: req.params.hire, 
                                                                    vehicle: req.body.vehicle, 
                                                                    hiree: req.body.hiree,
                                                                    hirer: req.body.hirer, 
                                                                    release_date: req.body.release_date, 
                                                                    release_time: req.body.release_time, 
                                                                    due_back_date: req.body.due_back_date, 
                                                                    due_back_time: req.body.due_back_time, 
                                                                    return_date: req.body.return_date, 
                                                                    return_time: req.body.return_time, 
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
    if (validatedData.return_date) vehicleHireFound.return.date = validatedData.return_date;
    if (validatedData.return_time) vehicleHireFound.return.time = validatedData.return_time;
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

const stopHire = async (req, res) => {

}

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
            return res.status(400).json(error);
        }
        res.status(200).json({message: `Vehicle hire record ${vehicleHireFound._id} inactivated / deleted` });
    });
}

const reactivateSoftDeletedVehicleHire = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getVehicleHireSchema.validateAsync({ hire: req.body.hire });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleHireFound = await VehicleHire.findOne({ _id: validatedData.hire }).exec();
    if (!vehicleHireFound) return res.status(404).json({ message: "Vehicle hire not found" });

    if (vehicleHireFound.active == false) {
        vehicleHireFound.active = true;
        vehicleHireFound.deleted_at = '';
    }

    vehicleHireFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({ success: `Vehicle hire ${vehicleHireFound._id} reactivated`, data: vehicleHireFound });
    });
}

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

    res.status(200).json({ success: `Vehicle hire record ${deletedVehicleHire} has been permanently deleted` })
}


module.exports = {
    getAllVehicleHires,
    getVehicleHire,
    createVehicleHire,
    updateVehicleHire,
    updateVehicleHireAdminLevel, 
    startHire, 
    stopHire, 
    softDeleteVehicleHire,
    reactivateSoftDeletedVehicleHire,
    deleteVehicleHire
}