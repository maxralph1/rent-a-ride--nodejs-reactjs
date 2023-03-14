const cloudinaryImageUpload = require('../config/imageUpload/cloudinary');
const VehicleLocation = require('../models/VehicleLocation');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Payment = require('../models/Payment');
const createUserSchema = require('../requestValidators/users/createUserValidator');
const updateUserSchema = require('../requestValidators/users/updateUserValidator');


const getAllUsers = async (req, res) => {
    const users = await User.find().sort('-created_at').lean();
    if (!users?.length) return res.status(404).json({ message: "No users found" });

    res.json(users);
};

const searchUsers = async (req, res) => {
    if (!req?.params?.searchKey) return res.status(400).json({ message: "Search key required" });

    let validatedData;
    try {
        validatedData = await searchUsersSchema.validateAsync({ searchKey: req.params.searchKey })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }

    const users = await User.find({$or: [{username: validatedData.searchKey}, {first_name: validatedData.searchKey}, {other_names: validatedData.searchKey}, {last_name: validatedData.searchKey}, {enterprise_name: validatedData.searchKey}, {address: validatedData.searchKey}]}).exec();
    if (!users?.length) return res.status(404).json({ message: "No user found" });

    res.status(200).json(users);
};

const getUser = async (req, res) => {
    if (!req?.params?.username) return res.status(400).json({ message: "Username required" });

    let validatedData;
    try {
        validatedData = await getUserSchema.validateAsync({ username: req.params.username })
    } catch (error) {
        return res.status(400).json({ message: "Search key validation failed", details: `${error}` });
    }
    
    const user = await User.findOne({ username: validatedData.username }).lean();
    if (!user) {
        return res.status(404).json({ message: `No user matches ${validatedData.username}` });
    }
    res.status(200).json(user.username, user.first_name, user.other_names, user.last_name, user.enterprise_name, user.address, user.picture_path );
};

const getUserPayments = async (req, res) => {
    const userFound = await User.findOne({ _id: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User does not exist." });
    const payments = await Payment.find({$or: [{user_hiring: userFound._id}, {user_renting: userFound._id}]}).sort('-created_at').exec();
    if (!payments?.length) return res.status(404).json({ message: "Found no payments made/received belonging to user" });

    res.status(200).json({ user: userFound.username, payments: payments });
    // res.status(200).json({ user: userFound.username, vehicles });
}

const getUserPaymentsMade = async (req, res) => {
    const userFound = await User.findOne({ _id: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User does not exist." });
    const payments = await Payment.find({ user_hiring: userFound._id }).sort('-created_at').exec();
    if (!payments?.length) return res.status(404).json({ message: "Found no payments made belonging to user" });

    res.status(200).json({ user: userFound.username, payments: payments });
    // res.status(200).json({ user: userFound.username, vehicles });
}

const getUserPaymentsReceived = async (req, res) => {
    const userFound = await User.findOne({ _id: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User does not exist." });
    const payments = await Payment.find({ user_renting: userFound._id }).sort('-created_at').exec();
    if (!payments?.length) return res.status(404).json({ message: "Found no received payments belonging to user" });

    res.status(200).json({ user: userFound.username, payments: payments });
    // res.status(200).json({ user: userFound.username, vehicles });
}

const getUserVehicles = async (req, res) => {
    const userFound = await User.findOne({ username: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User does not exist. Perhaps, you should search by their names or other identification markers to see if you could find the user you are looking for." });
    const vehicles = await Vehicle.find({ added_by: userFound._id }).sort('-created_at').exec();
    if (!vehicles?.length) return res.status(404).json({ message: "Found no vehicles belonging to user" });

    res.status(200).json({ user: userFound.username, vehicles: vehicles });
    // res.status(200).json({ user: userFound.username, vehicles });
}

const createUser = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createUserSchema.validateAsync({ username: req.body.username, 
                                                            password: req.body.password, 
                                                            first_name: req.body.first_name,
                                                            other_names: req.body.other_names,
                                                            last_name: req.body.last_name,
                                                            enterprise_name: req.body.enterprise_name,
                                                            email: req.body.email,
                                                            id_type: req.body.id_type,
                                                            id_number: req.body.id_number,
                                                            address: req.body.address, 
                                                            date_of_birth: req.body.date_of_birth, 
                                                            type: req.body.type, 
                                                            active: req.body.active, 
                                                            verified: req.body.verified, 
                                                            validUser: req.user._id });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userImageUpload = await cloudinaryImageUpload(image, "rent_a_ride_user_images");
    if (!userImageUpload) return res.status(409).json({ message: "Image upload failed" });

    const userIdentificationImageUpload = await cloudinaryImageUpload(image, "rent_a_ride_user_identification_images");
    if (!userIdentificationImageUpload) return res.status(409).json({ message: "Image upload failed" });

    let accountType;

    if (!validatedData.type) {
        accountType = "level1";
    } else if (validatedData.type && validatedData.type == "individual") {
        accountType = "level1";
    } else if (validatedData.type && validatedData.type == "enterprise") {
        accountType = "level2";
    } else if (validatedData.type && validatedData.type == "admin") {
        accountType = "level3";
    }

    const user = new User({
        username: validatedData.username,
        password: validatedData.password,
        first_name: validatedData.first_name,
        other_names: validatedData.other_names,
        last_name: validatedData.last_name,
        enterprise_name: validatedData.enterprise_name,
        email: validatedData.email,
        id_type: validatedData.id_type,
        id_number: validatedData.id_number,
        address: validatedData.address,
        date_of_birth: validatedData.date_of_birth,
        role: accountType,
        active: validatedData.active,
        user_picture_path: {
            public_id: userImageUpload.public_id,
            url: userImageUpload.secure_url
        },
        user_identification_image_path: {
            public_id: userIdentificationImageUpload.public_id,
            url: userIdentificationImageUpload.secure_url
        },
        verified: validatedData.verified,
        created_by: validatedData.validUser
    });

    user.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ message: `User ${user.username} created` });
    });
};

const updateUser = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updateUserSchema.validateAsync({ username: req.body.username, 
                                                            password: req.body.password, 
                                                            first_name: req.body.first_name,
                                                            other_names: req.body.other_names,
                                                            last_name: req.body.last_name,
                                                            enterprise_name: req.body.enterprise_name,
                                                            email: req.body.email,
                                                            id_type: req.body.id_type,
                                                            id_number: req.body.id_number,
                                                            address: req.body.address, 
                                                            date_of_birth: req.body.date_of_birth, 
                                                            type: req.body.type, 
                                                            validUser: req.user._id });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ username: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User not found" });

    const userImageUpload = await cloudinaryImageUpload(image, "rent_a_ride_user_images");
    if (!userImageUpload) return res.status(409).json({ message: "Image upload failed" });

    const userIdentificationImageUpload = await cloudinaryImageUpload(image, "rent_a_ride_user_identification_images");
    if (!userIdentificationImageUpload) return res.status(409).json({ message: "Image upload failed" });

    let accountType;

    if (!validatedData.type) {
        accountType = "level1";
    } else if (validatedData.type && validatedData.type == "individual") {
        accountType = "level1";
    } else if (validatedData.type && validatedData.type == "enterprise") {
        accountType = "level2";
    }

    if (validatedData.username) userFound.username = validatedData.username;
    if (validatedData.first_name) userFound.first_name = validatedData.first_name;
    if (validatedData.other_names) userFound.other_names = validatedData.other_names;
    if (validatedData.last_name) userFound.last_name = validatedData.last_name;
    if (validatedData.enterprise_name) userFound.enterprise_name = validatedData.enterprise_name;
    if (validatedData.email) userFound.email = validatedData.email;
    if (validatedData.id_type) userFound.id_type = validatedData.id_type;
    if (validatedData.id_number) userFound.id_number = validatedData.id_number;
    if (validatedData.address) userFound.address = address;
    if (validatedData.date_of_birth) userFound.date_of_birth = date_of_birth;
    if (validatedData.type) userFound.role = accountType;
    if (image) {
        userFound.picture_path.public_id = imageUpload.public_id;
        userFound.picture_path.url = imageUpload.secure_url;
    }
    if (image) {
        userFound.picture_path.public_id = userIdentificationImageUpload.public_id;
        userFound.picture_path.url = userIdentificationImageUpload.secure_url;
    }

    userFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `User ${userFound.username} updated` });
    });
};

const updateUserAdminLevel = async (req, res) => {

    let validatedData;
    try {
        validatedData = await updateUserSchema.validateAsync({ username: req.body.username, 
                                                            password: req.body.password, 
                                                            first_name: req.body.first_name,
                                                            other_names: req.body.other_names,
                                                            last_name: req.body.last_name,
                                                            enterprise_name: req.body.enterprise_name,
                                                            email: req.body.email,
                                                            id_type: req.body.id_type,
                                                            id_number: req.body.id_number,
                                                            address: req.body.address, 
                                                            date_of_birth: req.body.date_of_birth, 
                                                            type: req.body.type, 
                                                            active: req.body.active, 
                                                            verified: req.body.verified, 
                                                            validUser: req.user._id });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ username: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User not found" });

    const userImageUpload = await cloudinaryImageUpload(image, "rent_a_ride_user_images");
    if (!userImageUpload) return res.status(409).json({ message: "Image upload failed" });

    const userIdentificationImageUpload = await cloudinaryImageUpload(image, "rent_a_ride_user_identification_images");
    if (!userIdentificationImageUpload) return res.status(409).json({ message: "Image upload failed" });

    let accountType;

    if (!validatedData.type) {
        accountType = "level1";
    } else if (validatedData.type && validatedData.type == "individual") {
        accountType = "level1";
    } else if (validatedData.type && validatedData.type == "enterprise") {
        accountType = "level2";
    } else if (validatedData.type && validatedData.type == "admin") {
        accountType = "level3";
    }

    if (validatedData.username) userFound.username = validatedData.username;
    if (validatedData.first_name) userFound.first_name = validatedData.first_name;
    if (validatedData.other_names) userFound.other_names = validatedData.other_names;
    if (validatedData.last_name) userFound.last_name = validatedData.last_name;
    if (validatedData.enterprise_name) userFound.enterprise_name = validatedData.enterprise_name;
    if (validatedData.email) userFound.email = validatedData.email;
    if (validatedData.id_type) userFound.id_type = validatedData.id_type;
    if (validatedData.id_number) userFound.id_number = validatedData.id_number;
    if (validatedData.address) userFound.address = address;
    if (validatedData.date_of_birth) userFound.date_of_birth = date_of_birth;
    if (validatedData.type) userFound.role = accountType;
    if (image) {
        userFound.picture_path.public_id = imageUpload.public_id;
        userFound.picture_path.url = imageUpload.secure_url;
    }
    if (image) {
        userFound.picture_path.public_id = userIdentificationImageUpload.public_id;
        userFound.picture_path.url = userIdentificationImageUpload.secure_url;
    }
    if (validatedData.active) userFound.active = active;
    if (validatedData.verified) userFound.verified = verified;

    userFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `User ${userFound.username} updated` });
    });
};

const softDeleteUser = async (req, res) => {
    // Consider using this method for your delete instead of the "deleteUser" method below

    let validatedData;
    try {
        validatedData = await updateUserSchema.validateAsync({ username: req.body.username });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ username: validatedData.username }).exec();
    if (!userFound) return res.status(404).json({ message: "User not found" });

    if (userFound.active == true) {
        userFound.active = false;
        userFound.soft_deleted = new Date().toISOString();
    }

    userFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `User ${userFound.username} inactivated / deleted` });
    });
}

const reactivateSoftDeletedUser = async (req, res) => {

    let validatedData;
    try {
        validatedData = await reactivateSoftDeletedUserSchema.validateAsync({ username: req.body.username });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const userFound = await User.findOne({ username: validatedData.user }).exec();
    if (!userFound) return res.status(404).json({ message: "User not found" });

    if (userFound.active == false) {
        userFound.active = true; 
        userFound.soft_deleted = null; 
    }

    userFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({message: `User ${userFound.username} reactivated` });
    });
}

const deleteUser = async (req, res) => {
    // Consider not implementing this route on the client side, as other important/sensitive data like the payment information and vehicles could be affected. Rather, it is strongly recommended to use the "softDeleteUser" method above. 

    let validatedData;
    try {
        validatedData = await deleteUserSchema.validateAsync({ username: req.params.username })
    } catch (error) {
        return res.status(400).json({ message: "User search term validation failed", details: `${error}` });
    }

    const user = await User.findOne({ username: validatedData.username }).exec();
    if (!user) {
        return res.status(404).json({ message: `No user matches the user ${validatedData.username}` });
    }

    const payment = await Payment.find({ user: user._id}).exec();

    const vehicle = await Vehicle.find({ user: user._id}).exec();
    if (!user && !vehicle) {
        return res.status(404).json({ message: `No vehicles belong to the user`})
    }

    const deletedUser = await user.deleteOne();

    // if (location) {
    //     // Delete all locations belonging to the deleted user if there is any.
    //     await location.deleteMany();
    // }

    if (payment) {
        // Delete all payments belonging to the deleted user if there is any.
        await payment.deleteMany();
    }

    if (vehicle) {
        // Delete the location of the vehicle before the deleting the vehicle
        const location = await VehicleLocation.findOne({ vehicle: vehicle._id });
        await location.deleteOne();

        // Delete all vehicles belonging to the deleted user if there is any.
        await vehicle.deleteMany();
    }

    res.status(200).json({message: `User ${deletedUser} and all records belonging to user have been permannently deleted` })
};


module.exports = {
    getAllUsers,
    searchUsers,
    getUser,
    getUserPayments,
    getUserPaymentsMade,
    getUserPaymentsReceived,
    getUserVehicles,
    createUser,
    updateUser,
    updateUserAdminLevel,
    softDeleteUser,
    reactivateSoftDeletedUser,
    deleteUser
}