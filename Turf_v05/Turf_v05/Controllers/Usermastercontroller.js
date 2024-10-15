const UserModel = require('../Models/Usermaster');
const { logErrorToFile } = require('../ErrorLog');

// Function to generate a unique user_id in the format "U01", "U02", etc.
const generateUniqueUserId = async () => {
    let counter = 1;
    let newUserId;

    do {
        // Pad the counter with leading zeros and concatenate with 'U'
        newUserId = `U${counter.toString().padStart(2, '0')}`;
        counter++;
    } while (await UserModel.findOne({ user_id: newUserId }));

    return newUserId;
};

// Get all users (active and inactive)
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find()
        // .populate([
        //     { path: 'user_created_by', model: 'Admincollection', select: 'name ' },
        //     { path: 'user_updated_by', model: 'Admincollection', select: 'name ' },
        //     { path: 'user_deleted_by', model: 'Admincollection', select: 'name ' }
        // ]);
        res.status(200).json(users);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting users", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get active users
const getActiveUsers = async (req, res) => {
    try {
        const activeUsers = await UserModel.find({ isActive: 'Active', status: true })
            // .populate([
            //     { path: 'user_created_by', model: 'Admincollection', select: 'name ' },
            //     { path: 'user_updated_by', model: 'Admincollection', select: 'name ' },
            //     { path: 'user_deleted_by', model: 'Admincollection', select: 'name ' }
            // ])
        res.status(200).json(activeUsers);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active users", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get inactive users with status true
const getInactiveUsers = async (req, res) => {
    try {
        const inactiveUsers = await UserModel.find({ isActive: 'Inactive', status: true })
            // .populate([
            //     { path: 'user_created_by', model: 'Admincollection', select: 'name ' },
            //     { path: 'user_updated_by', model: 'Admincollection', select: 'name ' },
            //     { path: 'user_deleted_by', model: 'Admincollection', select: 'name ' }
            // ])
        res.status(200).json(inactiveUsers);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting inactive users", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get inactive users with status false
const getFalseStatusUsers = async (req, res) => {
    try {
        const falseStatusUsers = await UserModel.find({ isActive: 'Inactive', status: false })
            // .populate([
            //     { path: 'user_created_by', model: 'Admincollection', select: 'name ' },
            //     { path: 'user_updated_by', model: 'Admincollection', select: 'name ' },
            //     { path: 'user_deleted_by', model: 'Admincollection', select: 'name ' }
            // ])
        res.status(200).json(falseStatusUsers);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting users with false status", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await UserModel.find({ user_id: userId })
            // .populate([
            //     { path: 'user_created_by', model: 'Admincollection', select: 'name ' },
            //     { path: 'user_updated_by', model: 'Admincollection', select: 'name ' },
            //     { path: 'user_deleted_by', model: 'Admincollection', select: 'name ' }
            // ])

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting user by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get an active user by ID
const getActiveUserById = async (req, res) => {
    const userId = req.params.userId;

    try {
        const activeUser = await UserModel.findOne({ user_id: userId, isActive: 'Active', status: true })
            // .populate([
            //     { path: 'user_created_by', model: 'Admincollection', select: 'name ' },
            //     { path: 'user_updated_by', model: 'Admincollection', select: 'name ' },
            //     { path: 'user_deleted_by', model: 'Admincollection', select: 'name ' }
            // ])
        if (!activeUser) {
            return res.status(404).json({ error: "Active User not found" });
        }

        res.status(200).json(activeUser);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active user by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Create a new user with a dynamically generated user_id
const createUser = async (req, res) => {
    const { name, username, password, user_type, admin_id, admin_name } = req.body;

    try {
        // Generate a unique user_id (if needed)
        const newUserId = await generateUniqueUserId();

        // Create a new user with the generated user_id
        const newUser = new UserModel({
            user_id: newUserId,
            name,
            username,
            password,
            user_type,
            user_created_by: { admin_id, admin_name },
            created_at : new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active',
            status: true,
        });

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error creating user", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// update and create a new user with a dynamically generated user_id
const updateUserById = async (req, res) => {
    const userId = req.params.userId;
    const updateData = req.body;

    try {
        // Find the existing user
        const existingUser = await UserModel.findOne({ user_id: userId , isActive: "Active"});

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }
        // Mark all previous versions of the user as Inactive
        await UserModel.updateMany(
            { user_id: userId , isActive: "Active"},
            {
                $set: {
                    isActive: 'Inactive',
                    status: true,
                    user_updated_by: {
                        admin_id: updateData.admin_id,
                        admin_name: updateData.admin_name
                    } || existingUser.user_created_by,
                    updated_at: new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30))
                }
            }
        );
        /// Create a new user with the updated data and the same user_id
        const updatedUser = new UserModel({
            user_id: userId,
            name: updateData.name || existingUser.name,
            username: updateData.username || existingUser.username,
            password: updateData.password || existingUser.password,
            user_type: updateData.user_type || existingUser.user_type,
            user_created_by: {admin_id:updateData.admin_id,admin_name:updateData.admin_name} || existingUser.user_created_by,
            created_at : new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active',
            isActive: 'Active',
            status: true,
        });


        const savedUpdatedUser = await updatedUser.save();

        res.status(200).json({
            message: "User updated successfully",
            updatedUser: savedUpdatedUser,
        });
    } catch (error) {
        logErrorToFile(error);
        console.error("Error updating user by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


// Delete user by ID (mark as inactive)
const deleteUserById = async (req, res) => {
    const userId = req.params.userId;
    const { admin_id, admin_name , remarks} = req.body;
    const deldate = new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30));

    try {
        // Find the existing user
        const existingUser = await UserModel.findOne({ user_id: userId , isActive:"Active"});

        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        // Mark all previous versions of the user as Inactive
        // await UserModel.updateMany(
        //     { user_id: userId },
        //     { $set: { isActive: 'Inactive', status: false, deleted_at: new Date() } }
        // );

        // Mark the user as inactive and set the deleted type
        existingUser.set({
            isActive: 'Inactive',
            status: false,
            user_deleted_by: { admin_id, admin_name } || existingUser.user_created_by,
            remarks : remarks || "No remarks",
            deleted_at: deldate
        });

        await existingUser.save();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        logErrorToFile(error);
        console.error("Error marking user as inactive by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};



module.exports = {
    getAllUsers,
    getUserById,

    getActiveUsers,
    getInactiveUsers,
    getFalseStatusUsers,
    getActiveUserById,

    createUser,
    updateUserById,
    deleteUserById,
};
