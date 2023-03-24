const VehicleLocation = require('../models/VehicleLocation');
const Vehicle = require('../models/Vehicle');
const getVehicleLocationSchema = require('../requestValidators/locations/getVehicleLocationValidator')
const createVehicleLocationSchema = require('../requestValidators/locations/createVehicleLocationValidator');
const getVehicleSchema = require('../requestValidators/vehicles/getVehicleValidator');
const getUserSchema = require('../requestValidators/users/getUserValidator');


const getAllVehiclesLocations = async (req, res) => {
    const vehiclesLocations = await VehicleLocation.find().sort('-created_at').lean();
    if (!vehiclesLocations?.length) return res.status(404).json({ message: "No vehicle locations found" });

    res.json({ data: vehiclesLocations });
};

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

const getAllAuthUserVehicleLocations = async (req, res) => {
    const userFound = await User.findOne({ _id: req.user_id }).lean();
    const vehicleFound = await Vehicle.findOne({ user: userFound._id }).lean();

    const vehicleLocations = await VehicleLocation.find({ user: vehicleFound.vehicle }).sort('-created_at').lean();
    if (!vehicleLocations?.length) return res.status(404).json({ message: "No vehicle locations found" });

    res.json({ data: vehicleLocations });
}

// locations/vehicle-locations/vehicles/:vehicle
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
const addLatestVehicleLocation = async (req, res) => {
    
    let validatedData;
    try {
        validatedData = await createVehicleLocationSchema.validateAsync({ vehicle: req.params.vehicle, 
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
                return res.status(400).json(error);
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
            return res.status(400).json(error);
        }
        res.status(200).json({message: `Vehicle location updated` });
    });
    }
};

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
            return res.status(400).json(error);
        }
        res.status(200).json({ success: `Vehicle location ${vehicleLocationFound._id} inactivated / deleted` });
    });
};

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
            return res.status(400).json(error);
        }
        res.status(200).json({ success: `Vehicle location ${vehicleLocationFound._id} reactivated` });
    });
};

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
        return res.status(404).json({ message: `No vehicle matches the vehicle ${validatedData.vehicle}` });
    }

    const deletedVehicleLocation = await vehicleLocationFound.deleteOne();

    res.status(200).json({ success: `Vehicle location ${deletedVehicleLocation._id} has been permanently deleted` })
};


module.exports = {
    getAllVehiclesLocations, 
    getAllUserVehiclesLocations, 
    getAllAuthUserVehicleLocations, 
    getAllCurrentVehicleLocations,
    addLatestVehicleLocation, 
    softDeleteVehicleLocation, 
    reactivateSoftDeletedVehicleLocation, 
    deleteVehicleLocation
}