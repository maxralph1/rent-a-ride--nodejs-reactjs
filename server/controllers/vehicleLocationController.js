const Vehicle = require('../models/Vehicle');
const VehicleLocation = require('../models/VehicleLocation');
const createVehicleLocationSchema = require('../requestValidators/locationsValidator/createVehicleLocationValidator');
const updateVehicleLocationSchema = require('../requestValidators/locationsValidator/updateVehicleLocationValidator');


const getAllVehiclesLocations = async (req, res) => {
    const vehiclesLocations = await VehicleLocation.find().sort('-created_at').lean();
    if (!vehiclesLocations?.length) return res.status(404).json({ message: "No vehicle locations found" });

    res.json(vehiclesLocations);
};

const getAllCurrentVehicleLocations = async (req, res) => {
    const vehicleLocations = await VehicleLocation.find({ vehicle: req.body.id }).sort('-created_at').lean();
    if (!vehicleLocations?.length) return res.status(404).json({ message: "No vehicle locations found" });

    res.json(vehicleLocations);
};

const addUpdateVehicleLocation = async (req, res) => {
    let validatedData;
    try {
        validatedData = await updateVehicleLocationSchema.validateAsync({ address: req.body.address, 
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
            vehicle: validatedData.vehicle
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
}


module.exports = {
    getAllVehiclesLocations,
    getAllCurrentVehicleLocations,
    addUpdateVehicleLocation
}