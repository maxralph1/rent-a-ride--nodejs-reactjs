const User = require('../models/User');
const UserLocation = require('../models/UserLocation');
const createUserLocationSchema = require('../requestValidators/locationsValidator/createUserLocationValidator');
const updateUserLocationSchema = require('../requestValidators/locationsValidator/updateUserLocationValidator');


const getAllUsersLocations = async (req, res) => {
    const usersLocations = await UserLocation.find().sort('-created_at').lean();
    if (!usersLocations?.length) return res.status(404).json({ message: "No user locations found" });

    res.json(usersLocations);
};

const getAllCurrentUserLocations = async (req, res) => {
    const userLocations = await UserLocation.find({ user: req.body.id }).sort('-created_at').lean();
    if (!userLocations?.length) return res.status(404).json({ message: "No user locations found" });

    res.json(userLocations);
}

const addUpdateUserLocation = async (req, res) => {
    let validatedData;
    try {
        validatedData = await updateUserLocationSchema.validateAsync({ address: req.body.address, 
                                                                        latitude: req.body.latitude, 
                                                                        longitude: req.body.longitude, 
                                                                        plus_code: req.body.plus_code, 
                                                                        user: req.body.user });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ _id: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User not found" });

    const userLocationFound = await UserLocation.findOne({ user: userFound._id }).exec()


    if (!userLocationFound) {
        const userLocation = new UserLocation({
            address: validatedData.address,
            latitude: validatedData.latitude,
            longitude: validatedData.longitude,
            plus_code: validatedData.plus_code,
            user: validatedData.user
        })

        userLocation.save((error) => {
            if (error) {
                return res.status(400).json(error);
            }
            res.status(200).json({ message: `User location added`})
        })

    } else if (userLocationFound) {
        if (validatedData.address) userLocationFound.address = validatedData.address;
        if (validatedData.latitude) userLocationFound.latitude = validatedData.latitude;
        if (validatedData.longitude) userLocationFound.longitude = validatedData.longitude;
        if (validatedData.plus_code) userLocationFound.plus_code = validatedData.plus_code;

        userLocationFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `User location updated` });
    });
    }
}


module.exports = {
    getAllUsersLocations,
    getAllCurrentUserLocations,
    addUpdateUserLocation
}