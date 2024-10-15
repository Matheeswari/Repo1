const AdminModel = require('../Models/Adminmaster');
const { logErrorToFile } = require('../ErrorLog');

// Function to generate a unique admin_id in the format "A01", "A02", etc.
const generateUniqueAdminId = async () => {
    let counter = 1;
    let newAdminId;

    do {
        // Pad the counter with leading zeros and concatenate with 'A'
        newAdminId = `A${counter.toString().padStart(2, '0')}`;
        counter++;
    } while (await AdminModel.findOne({ admin_id: newAdminId }));

    return newAdminId;
};

// Get all admins (active and inactive)
const getAllAdmins = async (req, res) => {
    try {
        const admins = await AdminModel.find()
        res.status(200).json(admins);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting admins", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get active admins
const getActiveAdmins = async (req, res) => {
    try {
        const activeAdmins = await AdminModel.find({ isActive: 'Active', status: true })
        res.status(200).json(activeAdmins);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active admins", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get inactive admins with status true
const getInactiveAdmins = async (req, res) => {
    try {
        const inactiveAdmins = await AdminModel.find({ isActive: 'Inactive', status: true })
        res.status(200).json(inactiveAdmins);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting inactive admins", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get inactive admins with status false
const getFalseStatusAdmins = async (req, res) => {
    try {
        const falseStatusAdmins = await AdminModel.find({ isActive: 'Inactive', status: false })
        res.status(200).json(falseStatusAdmins);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting admins with false status", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get an admin by admin_id
const getAdminByAdminId = async (req, res) => {
    const adminId = req.params.adminId;

    try {
        const admin = await AdminModel.find({ admin_id: adminId });

        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.status(200).json(admin);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting admin by admin_id", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


// Get an active admin by ID
const getActiveAdminById = async (req, res) => {
    const adminId = req.params.adminId;

    try {
        const activeAdmin = await AdminModel.findOne({ admin_id: adminId, isActive: 'Active', status: true })

        if (!activeAdmin) {
            return res.status(404).json({ error: "Active Admin not found" });
        }

        res.status(200).json(activeAdmin);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active admin by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Create a new admin with a dynamically generated admin_id
const createAdmin = async (req, res) => {
    const { admin_id,admin_name, name, password } = req.body;

    try {
        // Generate a unique admin_id (if needed)
        const newAdminId = await generateUniqueAdminId();

        // Create a new admin with the generated admin_id
        const newAdmin = new AdminModel({
            admin_id: newAdminId,
            name,
            password,
            admin_created_by: { admin_id, admin_name },
            created_at:new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active',
            status: true,
        });

        const savedAdmin = await newAdmin.save();

        res.status(201).json(savedAdmin);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error creating admin", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const updateAdminById = async (req, res) => {
    const adminId = req.params.adminId;
    const updateData = req.body;

    try {
        // Find the existing admin using the correct field
        const existingAdmin = await AdminModel.findOne({ admin_id: adminId , isActive: "Active"  });

        if (!existingAdmin) {
            return res.status(404).json({ error: "Admin not found" });
        }

      // Mark all previous versions of the user as Inactive
      await AdminModel.updateMany(
        { admin_id: adminId , isActive: "Active"},
        {
            $set: {
                isActive: 'Inactive',
                status: true,
                admin_updated_by: {
                    admin_id: updateData.admin_id,
                    admin_name: updateData.admin_name
                } || existingAdmin.admin_created_by,
                updated_at: new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30))
            }
        }
    );

        // Create a new admin with the updated data and the same admin_id
        const updatedAdmin = new AdminModel({
            admin_id: adminId,
            name: updateData.name || existingAdmin.name,
            password: updateData.password || existingAdmin.password,
            admin_created_by: {admin_id:updateData.admin_id,admin_name:updateData.admin_name} || existingAdmin.admin_created_by,
            created_at : new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active',
            status: true,
        });

        const savedUpdatedAdmin = await updatedAdmin.save();

        res.status(200).json({
            message: "Admin updated successfully",
            updatedAdmin : savedUpdatedAdmin});
    } catch (error) {
        logErrorToFile(error);
        console.error("Error updating admin by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const deleteAdminById = async (req, res) => {
    const adminId = req.params.adminId;
    const { admin_id, admin_name , remarks} = req.body;

    const deldate = new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30))


    try {
        // Find the existing admin
        const existingAdmin = await AdminModel.findOne({ admin_id: adminId , isActive:"Active" });

        if (!existingAdmin) {
            return res.status(404).json({ error: "Admin not found" });
        }
// Mark all previous versions of the admin with the same ID as Inactive and set status to false
// await AdminModel.updateMany(
//     { admin_id: adminId, _id: { $ne: existingAdmin._id } },
//     { $set: { isActive: 'Inactive', status: false, updated_at: new Date() } }
// );
        // Mark the admin as inactive and set the deleted amount
        existingAdmin.isActive = 'Inactive';
        existingAdmin.status = false;
        existingAdmin.deleted_at = deldate;
        existingAdmin.remarks = remarks || "No remarks";
        existingAdmin.admin_deleted_by = { admin_id, admin_name } || existingAdmin.admin_created_by;
        existingAdmin.save();

        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        logErrorToFile(error);
        console.error("Error marking admin as inactive by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


const loginadmin = async (req, res)=>{
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            return res.json({ error: true, errorMessage: "Invalid fields." })
        }
        const user = await AdminModel.findOne({name , password});
        if (!user){
            return res.json({ error: true, errorMessage: "Invalid username or password" });
        }
        return res.json({
            user
        });
    } catch (error){
        logErrorToFile(error);
        console.log(error);
        return res.json({
            error: true,
            errorMessage: error
        })
    }
}

module.exports = {
    getAllAdmins,
    getActiveAdmins,
    getInactiveAdmins,
    getFalseStatusAdmins,
    getActiveAdminById,
    getAdminByAdminId,
    createAdmin,
    updateAdminById,
    deleteAdminById,
    loginadmin
};
