const Interaction = require('../models/Interaction');
const getInteractionSchema = require('../requestValidators/interactions/getInteractionValidator');
const createInteractionSchema = require('../requestValidators/interactions/createInteractionValidator');


const getInteractionByVehicle = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ vehicle: req.params.vehicle, 
                                                                    user: req.params.user });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactions = await Interaction.find({ for_vehicle: validatedData.vehicle, added_by: req.params.user }).sort('-created_at').lean();
    if (!interactions?.length) return res.status(404).json({ message: "No interactions found" });

    res.json({ data: interactions });
};

const getInteractionByVehicleAuth = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ vehicle: req.params.vehicle });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactions = await Interaction.find({ for_vehicle: validatedData.vehicle, added_by: req.user_id }).sort('-created_at').lean();
    if (!interactions?.length) return res.status(404).json({ message: "No interactions found" });

    res.json({ data: interactions });
};

const getInteractionByVehicleHire = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ hire: req.params.hire, 
                                                                    user: req.params.user });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactions = await Interaction.find({ for_vehicle_hire: validatedData.hire, added_by: req.params.user }).sort('-created_at').lean();
    if (!interactions?.length) return res.status(404).json({ message: "No interactions found" });

    res.json({ data: interactions });
};

const getInteractionByVehicleHireAuth = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ hire: req.params.hire });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactions = await Interaction.find({ for_vehicle_hire: validatedData.hire, added_by: req.user_id }).sort('-created_at').lean();
    if (!interactions?.length) return res.status(404).json({ message: "No interactions found" });

    res.json({ data: interactions });
};

const createInteractionForVehicle = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createInteractionSchema.validateAsync({ vehicle: req.params.vehicle, 
                                                                    message: req.body.message });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interaction = new Interaction({
        message: validatedData.message,
        for_vehicle: validatedData.vehicle,
        added_by: req.user_id
    });

    interaction.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ success: `Interaction ${interaction._id} added`, data: interaction });
    });
};

const createInteractionForVehicleHire = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createInteractionSchema.validateAsync({ vehicle: req.params.vehicle, 
                                                                    message: req.body.message });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interaction = new Interaction({
        message: validatedData.message,
        for_vehicle: validatedData.vehicle,
        added_by: req.user_id
    });

    interaction.save((error) => {
        if (error) {
            return res.status(400).json({ message: "An error occured", details: `${error}` });
        }
        res.status(201).json({ success: `Interaction ${interaction._id} added`, data: interaction });
    });
};

const updateInteraction = async (req, res) => {

    let validatedData;
    try {
        validatedData = await createInteractionSchema.validateAsync({ interaction: req.params.interaction, 
                                                                    message: req.body.message });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactionFound = await Interaction.findOne({$or: [{for_vehicle: validatedData.interaction}, {for_vehicle_hire: validatedData.interaction}]}).sort('-created_at').lean();
    if (!interactionFound) return res.status(404).json({ message: "Interaction not found" });

    interactionFound.message = validatedData.message;

    interactionFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({ success: `Interaction ${interactionFound._id} updated` });
    });
};

const softDeleteInteraction = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ interaction: req.params.interaction });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactionFound = await Interaction.findOne({ _id: validatedData.interaction }).exec();
    if (!interactionFound) return res.status(404).json({ message: "Interaction not found" });

    if (interactionFound.deleted_at == '') interactionFound.deleted_at = new Date().toISOString();

    interactionFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({ success: `Interaction ${interactionFound._id} inactivated / deleted` });
    });
};

const reactivateSoftDeletedInteraction = async (req, res) => {
    
    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ interaction: req.params.interaction });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactionFound = await Interaction.findOne({ _id: validatedData.interaction }).exec();
    if (!interactionFound) return res.status(404).json({ message: "Interaction not found" });

    if (interactionFound.deleted_at != '') interactionFound.deleted_at = '';

    interactionFound.save((error) => {
        if (error) {
            return res.status(400).json(error);
        }
        res.status(200).json({ success: `Interaction ${interactionFound._id} inactivated / deleted` });
    });
};

const deleteInteraction = async (req, res) => {

    let validatedData;
    try {
        validatedData = await getInteractionSchema.validateAsync({ interaction: req.params.interaction });
    } catch (error) {
        return res.status(400).json({ message: "Validation failed", details: `${error}` });
    }

    const interactionFound = await Interaction.findOne({ _id: validatedData.interaction }).exec();
    if (!interactionFound) {
        return res.status(404).json({ message: `No vehicle matches the vehicle ${validatedData.vehicle}` });
    }

    const deletedInteraction = await interactionFound.deleteOne();

    res.status(200).json({ success: `Vehicle location ${deletedInteraction._id} has been permanently deleted` })
};


module.exports = {
    getInteractionByVehicle, 
    getInteractionByVehicleAuth, 
    getInteractionByVehicleHire, 
    getInteractionByVehicleHireAuth, 
    createInteractionForVehicle, 
    createInteractionForVehicleHire, 
    updateInteraction, 
    softDeleteInteraction, 
    reactivateSoftDeletedInteraction, 
    deleteInteraction
}