const cloudinaryImageUpload = require('../config/imageUpload/cloudinary');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const createVehicleSchema = require('../requestValidators/vehicles/createVehicleValidator');
const updateVehicleSchema = require('../requestValidators/vehicles/updateVehicleValidator');


const getAllVehicles = async (req, res) => {
    const vehicles = await Vehicle.find().sort('-created_at').lean();
    if (!vehicles?.length) return res.status(404).json({ message: "No vehicles found" });

    res.status(200).json(vehicles);
};

const getVehicle = async (req, res) => {
    if (!req?.params?.vehicle) return res.status(400).json({ message: "Vehicle required" });

    let validatedData;
    try {
        validatedData = await getVehicleSchema.validateAsync({ id: req.params.id })
    } catch (error) {
        return res.status(400).json({ message: "Vehicle key validation failed", details: `${error}` });
    }

    const vehicleFound = await Vehicle.findOne({ _id: validatedData.vehicle }).lean();
    if (!vehicleFound) {
        return res.status(404).json({ message: `No vehicle matches ${validatedData.vehicle}` });
    }

    res.json(vehicleFound);
};

const searchVehicles = async (req, res) => {
    if (!req?.params?.searchKey) return res.status(400).json({ message: "Search key required" });

    let validatedData;
    try {
        validatedData = await searchVehiclesSchema.validateAsync({ searchKey: req.params.searchKey })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }

    const vehicles = await Vehicle.find({$or: [{vehicle_brand: validatedData.searchKey}, {vehicle_model: validatedData.searchKey}]}).exec();
    if (!vehicles?.length) return res.status(404).json({ message: "No vehicle found" });

    res.status(200).json(vehicles);
}

// const getUserVehicles = async (req, res) => {

//     let validatedData;
//     try {
//         validatedData = await getUserVehiclesSchema.validateAsync({ username: req.params.username })
//     } catch (error) {
//         return res.status(400).json({ message: "Vehicle key validation failed", details: `${error}` });
//     }

//     const userFound = await User.findOne({ username: validatedData.username }).exec();
//     if (!userFound) return res.status(404).json({ message: "User does not exist. Perhaps, you should search by their names or other identification markers to see if you could find the user you are looking for." });
//     const vehicles = await Vehicle.find({ added_by: userFound._id }).exec();
//     if (!vehicles?.length) return res.status(404).json({ message: "Found no vehicles belonging to user" });

//     res.status(200).json({ user: vehicleFound.username, vehicles: vehicles });
//     // res.status(200).json({ user: vehicleFound.username, vehicles });
// }

const createVehicle = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createVehicleSchema.validateAsync({ vehicle_brand: req.body.vehicle_brand, 
                                                                vehicle_model: req.body.vehicle_model,  
                                                                vehicle_engine_number: req.body.vehicle_engine_number, 
                                                                vehicle_identification_number: req.body.vehicle_identification_number, 
                                                                vehicle_plate_number: req.body.vehicle_plate_number, 
                                                                status: req.body.status,
                                                                verified: req.body.verified, 
                                                                validUser: req.user._id });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const imageUpload = await cloudinaryImageUpload(image, "rent_a_ride_vehicle_images");
    if (!imageUpload) return res.status(409).json({ message: "Image upload failed" });

    const vehicle = new Vehicle({
        vehicle_brand: validatedData.vehicle_brand,
        vehicle_model: validatedData.vehicle_model,
        vehicle_engine_number: validatedData.vehicle_engine_number,
        vehicle_identification_number: validatedData.vehicle_identification_number,
        vehicle_plate_number: validatedData.vehicle_plate_number,
        status: validatedData.status,    
        picture_path: {
            public_id: [imageUpload.public_id],
            url: [imageUpload.secure_url]
        },
        verified: validatedData.verified,
        active: true,
        added_by: validatedData.validUser
    });

    vehicle.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ message: `Vehicle ${vehicle.vehicle_brand} ${vehicle.vehicle_model} — ${vehicle.vehicle_plate_number} added` });
    });
};

const updateVehicle = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updateVehicleSchema.validateAsync({ id: req.body.id, 
                                                                vehicle_brand: req.body.vehicle_brand,
                                                                vehicle_model: req.body.vehicle_model,  
                                                                vehicle_engine_number: req.body.vehicle_engine_number, 
                                                                vehicle_identification_number: req.body.vehicle_identification_number, 
                                                                vehicle_plate_number: req.body.vehicle_plate_number, 
                                                                verified: req.body.verified });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleFound = await Vehicle.findOne({ _id: validatedData.id }).exec();
    if (!vehicleFound) return res.status(404).json({ message: "Vehicle not found" });

    const imageUpload = await cloudinaryImageUpload(image, "rent_a_ride_vehicle_images");
    if (!imageUpload) return res.status(409).json({ message: "Image upload failed" });

    if (validatedData.vehicle_brand) vehicleFound.vehicle_brand = validatedData.vehicle_brand;
    if (validatedData.vehicle_model) vehicleFound.vehicle_model = validatedData.vehicle_model;
    if (validatedData.vehicle_engine_number) vehicleFound.vehicle_engine_number = validatedData.vehicle_engine_number;
    if (validatedData.vehicle_identification_number) vehicleFound.vehicle_identification_number = validatedData.vehicle_identification_number;
    if (validatedData.vehicle_plate_number) vehicleFound.vehicle_plate_number = validatedData.vehicle_plate_number;
    if (image) {
        vehicleFound.picture_path.public_id = [imageUpload.public_id];
        vehicleFound.picture_path.url = [imageUpload.secure_url];
    }
    if (validatedData.verified) vehicleFound.verified = verified;

    vehicleFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `Vehicle ${vehicleFound.vehicle_brand} ${vehicleFound.vehicle_model} with plate number ${vehicleFound.vehicle_plate_number} updated` });
    });
};

const updateVehicleAdminLevel = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updateVehicleAdminLevelSchema.validateAsync({ id: req.body.id, 
                                                                            vehicle_brand: req.body.vehicle_brand,  
                                                                            vehicle_model: req.body.vehicle_model,  
                                                                            vehicle_engine_number: req.body.vehicle_engine_number, 
                                                                            vehicle_identification_number: req.body.vehicle_identification_number, 
                                                                            vehicle_plate_number: req.body.vehicle_plate_number, 
                                                                            status: req.body.status, 
                                                                            verified: req.body.verified, 
                                                                            active: req.body.active, 
                                                                            company_owned: req.body.company_owned });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleFound = await Vehicle.findOne({ _id: validatedData.id }).exec();
    if (!vehicleFound) return res.status(404).json({ message: "Vehicle not found" });

    const imageUpload = await cloudinaryImageUpload(image, "rent_a_ride_vehicle_images");
    if (!imageUpload) return res.status(409).json({ message: "Image upload failed" });

    if (validatedData.vehicle_brand) vehicleFound.validatedData.vehicle_brand = vehicle_brand;
    if (validatedData.vehicle_model) vehicleFound.vehicle_model = validatedData.vehicle_model;
    if (validatedData.vehicle_engine_number) vehicleFound.vehicle_engine_number = validatedData.vehicle_engine_number;
    if (validatedData.vehicle_identification_number) vehicleFound.vehicle_identification_number = validatedData.vehicle_identification_number;
    if (validatedData.vehicle_plate_number) vehicleFound.vehicle_plate_number = validatedData.vehicle_plate_number;
    if (validatedData.status) vehicleFound.status = validatedData.status;
    if (image) {
        vehicleFound.picture_path.public_id = [imageUpload.public_id];
        vehicleFound.picture_path.url = [imageUpload.secure_url];
    }
    if (validatedData.verified) vehicleFound.verified = verified;
    if (validatedData.active) vehicleFound.active = active;
    if (validatedData.company_owned) vehicleFound.company_owned = company_owned;

    vehicleFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `Vehicle ${vehicleFound.vehicle_brand} ${vehicleFound.vehicle_model} with plate number ${vehicleFound.vehicle_plate_number} updated` });
    });
};

const softDeleteVehicle = async (req, res) => {
    // Consider using this method for your delete instead of the "deleteVehicle" method below

    let validatedData;
    try {
        validatedData = await softDeleteVehicleSchema.validateAsync({ _id: req.body.id });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleFound = await Vehicle.findOne({ _id: validatedData.id }).exec();
    if (!vehicleFound) return res.status(404).json({ message: "Vehicle not found" });

    if (vehicleFound.active == true) {
        vehicleFound.active = false;
        vehicleFound.soft_deleted = new Date().toISOString();
    }

    vehicleFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `Vehicle ${vehicleFound.vehicle_brand} ${vehicleFound.vehicle_model} with plate number ${vehicleFound.vehicle_plate_number} inactivated / deleted` });
    });
}

const reactivateSoftDeletedVehicle = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updateVehicleSchema.validateAsync({ id: req.body.id });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const vehicleFound = await Vehicle.findOne({ _id: validatedData.id }).exec();
    if (!vehicleFound) return res.status(404).json({ message: "Vehicle not found" });

    if (vehicleFound.active == false) {
        vehicleFound.active = true;
        vehicleFound.soft_deleted = null;
    }

    vehicleFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `Vehicle ${vehicleFound.vehicle_brand} ${vehicleFound.vehicle_model} with plate number ${vehicleFound.vehicle_plate_number} reactivated` });
    });
}

const deleteVehicle = async (req, res) => {
    // Consider not implementing this route on the client side. Rather, it is strongly recommended to use the "softDeleteVehicle" method above. 

    let validatedData;
    try {
        validatedData = await deleteUserSchema.validateAsync({ _id: req.params.id })
    } catch (error) {
        return res.status(400).json({ message: "User search term validation failed", details: `${error}` });
    }

    const vehicle = await Vehicle.findOne({ _id: validatedData.id }).exec();
    if (!vehicle) {
        return res.status(404).json({ message: `No vehicle matches the vehicle ${validatedData.id}` });
    }

    const deletedVehicle = await vehicle.deleteOne();

    res.status(200).json({message: `Vehicle ${deletedVehicle} has been permanently deleted` })
};


module.exports = {
    getAllVehicles,
    getVehicle,
    searchVehicles,
    createVehicle,
    updateVehicle,
    updateVehicleAdminLevel,
    softDeleteVehicle,
    reactivateSoftDeletedVehicle,
    deleteVehicle
}