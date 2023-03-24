const UserLocation = require('../models/UserLocation');
const User = require('../models/User');
const getUserLocationSchema = require('../requestValidators/locations/getUserLocationValidator');
const createUserLocationSchema = require('../requestValidators/locationsValidator/createUserLocationValidator');
const getUserSchema = require('../requestValidators/users/getUserValidator');


const getAllUsersLocations = async (req, res) => {
    const usersLocations = await UserLocation.find().sort('-created_at').lean();
    if (!usersLocations?.length) return res.status(404).json({ message: "No user locations found" });

    res.json({ data: usersLocations });
};

// locations/user-locations/users/:user
const getAllCurrentUserLocations = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getUserSchema.validateAsync({ user: req.params.user })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }

    const userLocations = await UserLocation.find({ user: req.params.user }).sort('-created_at').lean();
    if (!userLocations?.length) return res.status(404).json({ message: "No user locations found" });

    res.json({ data: userLocations });
}

const getAllAuthUserLocations = async (req, res) => {

    const userLocations = await UserLocation.find({ user: req.user_id }).sort('-created_at').lean();
    if (!userLocations?.length) return res.status(404).json({ message: "No user locations found" });

    res.json({ data: userLocations });
}

// this API method is called intermittently by the physical user's device automatically
const addLatestUserLocation = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createUserLocationSchema.validateAsync({ address: req.body.address, 
                                                                    latitude: req.body.latitude, 
                                                                    longitude: req.body.longitude, 
                                                                    plus_code: req.body.plus_code });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const ifAuthenticatedUser = await User.findOne({ _id: req.user_id }).lean();

    if (ifAuthenticatedUser._id != req.user_id) {
        return res.status(403).json({ message: "You do not have permission to update user locations that do not belong to you" });

    } else if (ifAuthenticatedUser._id == req.user_id) {
        const userFound = await User.findOne({ _id: req.user_id }).exec();
        if (!userFound) return res.status(404).json({ message: "User not found" });

        const userLocationFound = await UserLocation.findOne({ user: userFound._id }).exec()

        const userLocation = new UserLocation({
            address: validatedData.address,
            latitude: validatedData.latitude,
            longitude: validatedData.longitude,
            plus_code: validatedData.plus_code,
            user: userLocationFound.user
        })

        userLocation.save((error) => {
            if (error) {
                return res.status(400).json(error);
            }
            res.status(200).json({ message: `User location added`})
        });
    };
};

const softDeleteUserLocation = async (req, res) => {
    // Consider using this method for your delete instead of the "deleteUser" method below

    let validatedData;
    try {
        validatedData = await getUserLocationSchema.validateAsync({ userLocation: req.params.userLocation });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userLocationFound = await UserLocation.findOne({ _id: validatedData.userLocation }).exec();

    if (userLocationFound.user != req.user_id) {
        return res.status(403).json({ message: "You do not have permission to delete locations that do not belong to you that do not belong to you" });

    } else if (userLocationFound.user == req.user_id) {

        if (!userLocationFound) return res.status(404).json({ message: "User location not found" });

        if (userLocationFound.deleted_at == '') userLocationFound.deleted_at = new Date().toISOString();

        userLocationFound.save((error) => {
            if (error) {
                return res.status(400).json(error);
            }
            res.status(200).json({ success: `User location ${userLocationFound._id} inactivated / deleted` });
        });
    };
};

const reactivateSoftDeletedUserLocation = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getUserLocationSchema.validateAsync({ userLocation: req.params.userLocation });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userLocationFound = await UserLocation.findOne({ _id: validatedData.userLocation }).exec();
    if (!userLocationFound) return res.status(404).json({ message: "User location not found" });

    if (userLocationFound.deleted_at != '') userLocationFound.deleted_at = '';

    userLocationFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({ success: `User location ${userLocationFound._id} reactivated` });
    });
};

const deleteUserLocation = async (req, res) => {
    // Consider not implementing this route on the client side. Rather, it is strongly recommended to use the "softDeleteUser" method above. 

    let validatedData;
    try {
        validatedData = await getUserLocationSchema.validateAsync({ userLocation: req.params.userLocation })
    } catch (error) {
        return res.status(400).json({ message: "Parameter validation failed", details: `${error}` });
    }

    const userLocationFound = await User.findOne({ _id: validatedData.userLocation }).exec();
    if (!userLocationFound) {
        return res.status(404).json({ message: `No user matches the user ${validatedData.user}` });
    }

    const deletedUserLocation = await userLocationFound.deleteOne();

    res.status(200).json({ success: `User location ${deletedUserLocation._id} has been permanently deleted` })
};


module.exports = {
    getAllUsersLocations,
    getAllCurrentUserLocations, 
    getAllAuthUserLocations, 
    addLatestUserLocation, 
    softDeleteUserLocation, 
    reactivateSoftDeletedUserLocation, 
    deleteUserLocation
}