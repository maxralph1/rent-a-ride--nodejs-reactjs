const ContactUs = require('../models/ContactUs');
const getContactUsSchema = require('../requestValidators/contactUs/getContactUsValidator');
const createContactUsSchema = require('../requestValidators/contactUs/createContactUsValidator');


const getAllContactUsMessages = async (req, res) => {
    const interactions = await ContactUs.find({ for_vehicle: validatedData.vehicle, added_by: req.params.user }).sort('-created_at').lean();
    if (!interactions?.length) return res.status(404).json({ message: "No interactions found" });

    res.json({ data: interactions });
};

const createContactUsMessage = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createContactUsSchema.validateAsync({ title: req.params.title, 
                                                                body: req.body.body, 
                                                                name: req.body.name, 
                                                                email: req.body.email });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const contactUs = new ContactUs({
        title: validatedData.title,
        body: validatedData.body,
        name: validatedData.name,
        email: validatedData.email
    });

    contactUs.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ success: `ContactUs ${contactUs._id} added`, data: contactUs });
    });
}

const deleteContactUsMessage = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getContactUsSchema.validateAsync({ message: req.params.message });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const contactUsMessageFound = await ContactUs.findOne({ _id: validatedData.message }).exec();
    if (!contactUsMessageFound) {
        return res.status(404).json({ message: `No vehicle matches the vehicle ${validatedData.vehicle}` });
    }

    const deletedContactUsMessage = await contactUsMessageFound.deleteOne();

    res.status(200).json({ success: `Message ${deletedContactUsMessage._id} has been permanently deleted` })
}


module.exports = {
    getAllContactUsMessages, 
    createContactUsMessage, 
    deleteContactUsMessage
}