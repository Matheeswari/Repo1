const CustomerModel = require('../Models/Customermaster');
const { logErrorToFile } = require('../ErrorLog');


// Function to generate a unique admin_id in the format "A01", "A02", etc.
const generateUniqueCustomerId = async () => {
    let counter = 1;
    let newCustomerId;

    do {
        // Pad the counter with leading zeros and concatenate with 'A'
        newCustomerId = `CS${counter.toString().padStart(2, '0')}`;
        counter++;
    } while (await CustomerModel.findOne({ customer_id: newCustomerId }));

    return newCustomerId;
};
// Get all customers (active and inactive)
const getAllCustomers = async (req, res) => {
    try {
        const customers = await CustomerModel.find()
        // .populate([
        //     { path: 'c_created_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'c_updated_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'c_deleted_by', model: 'Usercollection', select: 'name user_type' }
        // ])

        res.status(200).json(customers);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting customers", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get active customers
const getActiveCustomers = async (req, res) => {
    try {
        const activeCustomers = await CustomerModel.find({ isActive: 'Active', status: true })
        // .populate([
        //     { path: 'c_created_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'c_updated_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'c_deleted_by', model: 'Usercollection', select: 'name user_type' }
        // ])
        res.status(200).json(activeCustomers);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active customers", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get inactive customers with status true
const getInactiveCustomers = async (req, res) => {
    try {
        const inactiveCustomers = await CustomerModel.find({ isActive: 'Inactive', status: true })
        // .populate([
        //     { path: 'c_created_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'c_updated_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'c_deleted_by', model: 'Usercollection', select: 'name user_type' }
        // ])
        res.status(200).json(inactiveCustomers);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting inactive customers", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get inactive customers with status false
const getFalseStatusCustomers = async (req, res) => {
    try {
        const falseStatusCustomers = await CustomerModel.find({ isActive: 'Inactive', status: false })
        // .populate([
        //     { path: 'c_created_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'c_updated_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'c_deleted_by', model: 'Usercollection', select: 'name user_type' }
        // ])
        res.status(200).json(falseStatusCustomers);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting customers with false status", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get a customer by ID
const getCustomerById = async (req, res) => {
    const customerId = req.params.customerId;

    try {
        const customer = await CustomerModel.find({ customer_id: customerId })
        // .populate([
        //     { path: 'c_created_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'c_updated_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'c_deleted_by', model: 'Usercollection', select: 'name user_type' }
        // ])

        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        res.status(200).json(customer);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting customer by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get an active customer by ID
const getActiveCustomerById = async (req, res) => {
    const customerId = req.params.customerId;

    try {
        const activeCustomer = await CustomerModel.findOne({ customer_id: customerId, isActive: 'Active', status: true })
        // .populate([
        //     { path: 'c_created_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'c_updated_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'c_deleted_by', model: 'Usercollection', select: 'name user_type' }
        // ])

        if (!activeCustomer) {
            return res.status(404).json({ error: "Active Customer not found" });
        }

        res.status(200).json(activeCustomer);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active customer by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Create a new customer with a dynamically generated c_id
const createCustomer = async (req, res) => {
    const { customer_name, phonenumber, description, admin_id, admin_name } = req.body;
    let existingCustomer = await CustomerModel.findOne({ phonenumber:phonenumber ,isActive:"Active",status:true});
        console.log(existingCustomer);
    if(existingCustomer){
        return res.status(404).json({ error:"PhoneNo already exists"});
    }

    try {
        // Generate a unique c_id (if needed)
        const newCustomerId = await generateUniqueCustomerId();

        // Create a new customer with the generated c_id
        const newCustomer = new CustomerModel({
            customer_id: newCustomerId,
            customer_name,
            phonenumber,
            description,
            customer_created_by: { admin_id, admin_name },
            created_at: new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active',
            status: true,
        });

        const savedCustomer = await newCustomer.save();

        res.status(201).json(savedCustomer);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error creating customer", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Update customer by ID (mark older as inactive, create new active one with a new c_id)
const updateCustomerById = async (req, res) => {
    const customerId = req.params.customerId;
    const updateData = req.body;

    try {
        // Find the existing customer
        const existingCustomer = await CustomerModel.findOne({ customer_id: customerId,isActive:"Active"});

        if (!existingCustomer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        // Mark all previous versions of the user as Inactive
        await CustomerModel.updateMany(
            { customer_id: customerId,isActive:"Active" },
            { $set: { isActive:'Inactive',
                      status:true,  
                      customer_updated_by:{admin_id:updateData.admin_id,
                                           admin_name:updateData.admin_name} || existingCustomer.customer_created_by,
                      updated_at:new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30))
                    } }
        ); 

        // Create a new customer with the updated data and a new c_id
        const newCustomer = new CustomerModel({
            customer_id: customerId,
            customer_name: updateData.customer_name || existingCustomer.customer_name, // Set the updated c_name
            phonenumber: updateData.phonenumber || existingCustomer.phonenumber, // Set the updated phonenumber
            description: updateData.description || existingCustomer.description, // Set the updated description
            customer_created_by: {admin_id:updateData.admin_id,admin_name:updateData.admin_name} || existingCustomer.customer_created_by,
            created_at : new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active',
            status: true,
        });

        await newCustomer.save();

        res.status(200).json({
            message: "Customer updated successfully",
            updatedUser: newCustomer,
        });
    } catch (error) {
        logErrorToFile(error);
        console.error("Error updating customer by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Delete customer by ID (mark as inactive)
const deleteCustomerById = async (req, res) => {
    const customerId = req.params.customerId;
    const { admin_id, admin_name, remarks } = req.body;
    const deldate = new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30))

    try {
        // Find the existing customer
        const existingCustomer = await CustomerModel.findOne({ customer_id: customerId, isActive:"Active" });

        if (!existingCustomer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        
        // Mark all previous versions of the user as Inactive
        // await CustomerModel.updateMany(
        //     { customer_id: customerId },
        //     { $set: { isActive: 'Inactive', status: false } }
        // );

        // Mark the user as inactive and set the deleted type
        existingCustomer.set({
            isActive: 'Inactive',
            status: false,
            customer_deleted_by: { admin_id, admin_name } || existingCustomer.customer_deleted_by,
            remarks : remarks || "No remarks",
            deleted_at: deldate,
        });

        await existingCustomer.save();

        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        logErrorToFile(error);
        console.error("Error marking customer as inactive by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getCustomerBySearch = async (req, res) => {
    const key = req.body.key.toString();
    let query = [
        {
            '$match': {
                'isActive': 'Active',
                'status': true,
                '$or': [
                    {
                        'customer_name': {
                            '$regex': key,
                            '$options': 'i'
                        }
                    }, {
                        'phonenumber': {
                            '$regex': key,
                            '$options': 'i'
                        }
                    }
                ]
            }
        }
    ];
    await CustomerModel.aggregate(query)
    .then((customer) => {
        if (customer.length > 0) {
            res.json(customer);   
        }
        else {
            res.json("Customer not available...");
        }
    
    }).catch((error) => {
        logErrorToFile(error);
        res.status(500).json({ error: "Error getting customer"+ err });
    });
}

module.exports = {
    getCustomerBySearch,
    getAllCustomers,
    getActiveCustomers,
    getInactiveCustomers,
    getFalseStatusCustomers,
    getCustomerById,
    getActiveCustomerById,
    createCustomer,
    updateCustomerById,
    deleteCustomerById,
};
