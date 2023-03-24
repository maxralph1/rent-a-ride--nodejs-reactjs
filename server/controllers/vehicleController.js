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


const getAllVehicles = async (req, res) => {
    const vehicles = await Vehicle.find().sort('-created_at').lean();
    if (!vehicles?.length) return res.status(404).json({ message: "No vehicles found" });

    res.status(200).json({ data: vehicles });
};

const getAuthUserVehicles = async (req, res) => {
    const userFound = await User.findOne({ _id: req.user_id }).exec();
    
    if (!userFound) return res.status(404).json({ message: "User does not exist. Perhaps, you should search by their names or other identification markers to see if you could find the user you are looking for." });

    const vehicles = await Vehicle.find({ added_by: userFound._id }).exec();
    if (!vehicles?.length) return res.status(404).json({ message: "Found no vehicles belonging to user" });

    res.status(200).json({ data: vehicles });
}

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
        return res.status(404).json({ message: `No vehicle matches ${validatedData.vehicle}` });
    }

    res.status(200).json({ data: vehicleFound });
};

const createVehicle = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createVehicleSchema.validateAsync({ vehicle_type: req.body.vehicle_type, 
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
    if (!user) return res.status(409).json({ message: "You must be signed in to add a vehicle. You may sign up for an account, if you do not have one." });

    const files = req.files.post_photos;

    const urls = []

    if (Array.isArray(files)) {
        for (const file of files) {
            const imageUpload = await cloudinaryImageUpload(file.tempFilePath, "rent_a_ride_vehicle_images");
            if (!imageUpload) return res.status(409).json({ message: "Image upload failed" });
            
            urls.push(imageUpload.secure_url)
        }
    } else {
        const imageUpload = await cloudinaryImageUpload(files.tempFilePath, "rent_a_ride_vehicle_images");
        if (!imageUpload) return res.status(409).json({ message: "Image upload failed" });

        urls.push(imageUpload.secure_url)
    }

    const newVehicle = new Vehicle({
        vehicle_type: validatedData.vehicle_type,
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
        res.status(201).json({ success: `Vehicle ${vehicle.vehicle_brand} ${vehicle.vehicle_model} — ${vehicle.vehicle_plate_number} added`, data: newVehicle });
    });
};

const updateVehicle = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updateVehicleSchema.validateAsync({ vehicle: req.params.vehicle, 
                                                                vehicle_type: req.body.vehicle_type, 
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
        return res.status(403).json({ message: "You do not have permission to update posts that do not belong to you" });

    } else if (ifAuthenticatedUser._id == req.user_id) {

        const vehicleFound = await Vehicle.findOne({ _id: validatedData.vehicle }).exec();
        if (!vehicleFound) return res.status(404).json({ message: "Vehicle not found" });

        const urls = []

        const files = req.files.post_photos;

        if (Array.isArray(files)) {
            for (const file of files) {
                const imageUpload = await cloudinaryImageUpload(file.tempFilePath, "rent_a_ride_vehicle_images");
                if (!imageUpload) return res.status(409).json({ message: "Image upload failed" });
                
                urls.push(imageUpload.secure_url)
            }
        } else {
            const imageUpload = await cloudinaryImageUpload(files.tempFilePath, "rent_a_ride_vehicle_images");
            if (!imageUpload) return res.status(409).json({ message: "Image upload failed" });

            urls.push(imageUpload.secure_url)
        }

        if (validatedData.vehicle_type) vehicleFound.vehicle_type = validatedData.vehicle_type;
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

        vehicleFound.save((error) => {
            if (error) {
                return res.status(400).json(error);
            }
            res.status(200).json({ success: "Vehicle record updated", data: vehicleFound });
        });
    };
};

const updateVehicleAdminLevel = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updateVehicleSchema.validateAsync({ vehicle_type: req.body.vehicle_type, 
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

    const files = req.files.post_photos;

    if (Array.isArray(files)) {
        for (const file of files) {
            const imageUpload = await cloudinaryImageUpload(file.tempFilePath, "rent_a_ride_vehicle_images");
            if (!imageUpload) return res.status(409).json({ message: "Image upload failed" });
            
            urls.push(imageUpload.secure_url)
        }
    } else {
        const imageUpload = await cloudinaryImageUpload(files.tempFilePath, "rent_a_ride_vehicle_images");
        if (!imageUpload) return res.status(409).json({ message: "Image upload failed" });

        urls.push(imageUpload.secure_url)
    }

    if (validatedData.vehicle_type) vehicleFound.vehicle_type = validatedData.vehicle_type;
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
            return res.status(400).json(error);
        }
        res.status(200).json({ success: "Vehicle record updated", data: vehicleFound });
    });
};

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
            return res.status(400).json(error);
        }
        res.status(200).json({success: `Vehicle ${vehicleFound.vehicle_brand} ${vehicleFound.vehicle_model} with plate number ${vehicleFound.vehicle_plate_number} inactivated / deleted` });
    });
}

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
            return res.status(400).json(error);
        }
        res.status(200).json({ success: `Vehicle ${vehicleFound.vehicle_brand} ${vehicleFound.vehicle_model} with plate number ${vehicleFound.vehicle_plate_number} reactivated`, data: vehicleFound });
    });
}

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

    res.status(200).json({ success: `Vehicle ${deletedVehicle} has been permanently deleted` })
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