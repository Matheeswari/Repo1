const PaymentModel = require('../Models/Paymentmodemaster');
const { logErrorToFile } = require('../ErrorLog');

// Function to generate a unique admin_id in the format "A01", "A02", etc.
const generateUniquePaymentId = async () => {
    let counter = 1;
    let newPaymentId;

    do {
        // Pad the counter with leading zeros and concatenate with 'A'
        newPaymentId = `P${counter.toString().padStart(2, '0')}`;
        counter++;
    } while (await PaymentModel.findOne({ payment_id: newPaymentId }));

    return newPaymentId;
};
// Get all payments (active and inactive)
const getAllPayments = async (req, res) => {
    try {
        const payments = await PaymentModel.find()
            // .populate([
            //     { path: 'payment_created_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_updated_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_deleted_by', model: 'Usercollection', select: 'name user_type' }
            // ])

        res.status(200).json(payments);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting payments", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get active payments
const getActivePayments = async (req, res) => {
    try {
        const activePayments = await PaymentModel.find({ isActive: 'Active', status: true })
            // .populate([
            //     { path: 'payment_created_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_updated_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_deleted_by', model: 'Usercollection', select: 'name user_type' }
            // ])

        res.status(200).json(activePayments);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active payments", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get inactive payments with status true
const getInactivePayments = async (req, res) => {
    try {
        const inactivePayments = await PaymentModel.find({ isActive: 'Inactive', status: true })
            // .populate([
            //     { path: 'payment_created_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_updated_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_deleted_by', model: 'Usercollection', select: 'name user_type' }
            // ])

        res.status(200).json(inactivePayments);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting inactive payments", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get inactive payments with status false
const getFalseStatusPayments = async (req, res) => {
    try {
        const falseStatusPayments = await PaymentModel.find({ isActive: 'Inactive', status: false })
            // .populate([
            //     { path: 'payment_created_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_updated_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_deleted_by', model: 'Usercollection', select: 'name user_type' }
            // ])

        res.status(200).json(falseStatusPayments);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting payments with false status", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get a payment by ID
const getPaymentById = async (req, res) => {
    const paymentId = req.params.paymentId;

    try {
        const payment = await PaymentModel.find({ payment_id: paymentId })
            // .populate([
            //     { path: 'payment_created_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_updated_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_deleted_by', model: 'Usercollection', select: 'name user_type' }
            // ])


        if (!payment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        res.status(200).json(payment);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting payment by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get an active payment by ID
const getActivePaymentById = async (req, res) => {
    const paymentId = req.params.paymentId;

    try {
        const activePayment = await PaymentModel.findOne({ payment_id: paymentId, isActive: 'Active', status: true })
            // .populate([
            //     { path: 'payment_created_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_updated_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_deleted_by', model: 'Usercollection', select: 'name user_type' }
            // ])


        if (!activePayment) {
            return res.status(404).json({ error: "Active Payment not found" });
        }

        res.status(200).json(activePayment);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active payment by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Create a new payment with a dynamically generated payment_id
const createPayment = async (req, res) => {
    const { payment_mode, admin_id, admin_name } = req.body;

    try {
        // Generate a unique payment_id (if needed)
        const newPaymentId = await generateUniquePaymentId();

        // Create a new payment with the generated payment_id
        const newPayment = new PaymentModel({
            payment_id: newPaymentId,
            payment_mode,
            payment_created_by: { admin_id, admin_name },
            created_at: new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active',
            status: true,
        });

        const savedPayment = await newPayment.save();

        res.status(201).json(savedPayment);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error creating payment", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Update payment by ID (mark older as inactive, create new active one with a new payment_id)
const updatePaymentById = async (req, res) => {
    const paymentId = req.params.paymentId;
    const updateData = req.body;

    try {
        // Find the existing payment
        const existingPayment = await PaymentModel.findOne({ payment_id: paymentId,isActive: "Active"});

        if (!existingPayment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        // Mark all previous versions of the user as Inactive
        await PaymentModel.updateMany(
            { payment_id: paymentId, isActive: "Active" },
            { $set: {
                    isActive: 'Inactive',
                    status: true,
                    payment_updated_by: {
                        admin_id: updateData.admin_id,
                        admin_name: updateData.admin_name
                    } || existingPayment.payment_created_by,
                    updated_at: new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30))
                } }
        );

        // Create a new payment with the updated data and a new payment_id
        const newPayment = new PaymentModel({
            payment_id: paymentId,
            payment_mode: updateData.payment_mode || existingPayment.payment_mode, 
            payment_created_by : {
                admin_id: updateData.admin_id,
                admin_name: updateData.admin_name,
            } || existingPayment.payment_created_by,
            created_at : new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active',
            status: true,
        });

        const savedNewPayment = await newPayment.save();

        res.status(200).json({
            message: "Payment updated successfully",
            updatedPayment: savedNewPayment,
        });
    } catch (error) {
        logErrorToFile(error);
        console.error("Error updating payment by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


// Delete payment by ID (mark as inactive)
const deletePaymentById = async (req, res) => {
    const paymentId = req.params.paymentId;
    const { admin_id, admin_name , remarks} = req.body;
    const deldate = new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30))

    try {
        // Find the existing payment
        const existingPayment = await PaymentModel.findOne({ payment_id: paymentId, isActive:"Active" });

        if (!existingPayment) {
            return res.status(404).json({ error: "Payment not found" });
        }

        // Mark all previous versions of the user as Inactive
        // await PaymentModel.updateMany(
        //     { payment_id: paymentId },
        //     { $set: { isActive: 'Inactive', status: false, deleted_at: new Date() } }
        // );

         // Mark the user as inactive and set the deleted type
         existingPayment.set({
            isActive: 'Inactive',
            status: false,
            payment_deleted_by: { admin_id, admin_name } || existingPayment.payment_created_by,
            remarks : remarks || "No remarks",
            deleted_at: deldate,
        });

        await existingPayment.save();

        res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
        logErrorToFile(error);
        console.error("Error marking payment as inactive by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

// Get payments by created_at date
const getPaymentsByDate = async (req, res) => {
    // Assuming date is passed as a parameter in the request
    const requestedDate = new Date(`${req.params.date}T00:00:00Z`);
    try {
        // Convert the requested date to a JavaScript Date object
        const searchDate = new Date(requestedDate);

        // Find payments with the given created_at date
        const paymentsByDate = await PaymentModel.find({ created_at: { $gte: searchDate, $lt: new Date(searchDate.getTime() + 86400000) } })
            // .populate([
            //     { path: 'payment_created_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_updated_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_deleted_by', model: 'Usercollection', select: 'name user_type' }
            // ]);

        res.status(200).json(paymentsByDate);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting payments by created_at date", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



module.exports = {
    getAllPayments,
    getPaymentById,

    getActivePayments,
    getInactivePayments,
    getFalseStatusPayments,
    getActivePaymentById,

    createPayment,
    updatePaymentById,
    deletePaymentById,

    getPaymentsByDate,
};
