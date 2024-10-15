const CategoryModel = require('../Models/Categorymaster');
const { logErrorToFile } = require('../ErrorLog');

// Function to generate a unique category_id in the format "A01", "A02", etc.
const generateUniquecategoryId = async () => {
    let counter = 1;
    let newCategoryId;

    do {
        // Pad the counter with leading zeros and concatenate with 'A'
        newCategoryId = `C${counter.toString().padStart(2, '0')}`;
        counter++;
    } while (await CategoryModel.findOne({ category_id: newCategoryId }));

    return newCategoryId;
};

// Get all Category (active and inactive)
const getAllCategory = async (req, res) => {
    try {
        const categories = await CategoryModel.find()
        // .populate([
        //     { path: 'expense_category_created_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'expense_category_updated_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'expense_category_deleted_by', model: 'Usercollection', select: 'name user_type' }
        // ])

        res.status(200).json(categories);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting categories", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get active Category
const getActiveCategory = async (req, res) => {
    try {
        const activeCategory = await CategoryModel.find({ isActive: 'Active', status: true })
        // .populate([
        //     { path: 'expense_category_created_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'expense_category_updated_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'expense_category_deleted_by', model: 'Usercollection', select: 'name user_type' }
        // ])

        res.status(200).json(activeCategory);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active categories", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get inactive Category with status true
const getInactiveCategory = async (req, res) => {
    try {
        const inactiveCategory = await CategoryModel.find({ isActive: 'Inactive', status: true })
        // .populate([
        //     { path: 'expense_category_created_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'expense_category_updated_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'expense_category_deleted_by', model: 'Usercollection', select: 'name user_type' }
        // ])

        res.status(200).json(inactiveCategory);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting inactive categories", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get inactive Category with status false
const getFalseStatusCategory = async (req, res) => {
    try {
        const falseStatuscategories = await CategoryModel.find({ isActive: 'Inactive', status: false })
            .populate([
                { path: 'expense_category_created_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_category_updated_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_category_deleted_by', model: 'Usercollection', select: 'name user_type' }
            ])

        res.status(200).json(falseStatuscategories);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting category with false status", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get a Category by ID
const getCategoryById = async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        const category = await CategoryModel.find({ category_id: categoryId })
        // .populate([
        //     { path: 'expense_category_created_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'expense_category_updated_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'expense_category_deleted_by', model: 'Usercollection', select: 'name user_type' }
        // ])


        if (!category) {
            return res.status(404).json({ error: "category not found" });
        }

        res.status(200).json(category);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting category by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get an active Category by ID
const getActiveCategoryById = async (req, res) => {
    const categoryId = req.params.categoryId;

    try {
        const activecategory = await CategoryModel.findOne({ category_id: categoryId, isActive: 'Active', status: true })
        // .populate([
        //     { path: 'expense_category_created_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'expense_category_updated_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'expense_category_deleted_by', model: 'Usercollection', select: 'name user_type' }
        // ])


        if (!activecategory) {
            return res.status(404).json({ error: "Active category not found" });
        }

        res.status(200).json(activecategory);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active category by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Create a new category with a dynamically generated category_id
const createCategory = async (req, res) => {
    const { expense_category, admin_id, admin_name } = req.body;

    try {
        // Generate a unique category_id (if needed)
        const newcategoryId = await generateUniquecategoryId();

        // Create a new category with the generated category_id
        const newcategory = new CategoryModel({
            category_id: newcategoryId,
            expense_category,
            expense_category_created_by: { admin_id, admin_name },
            created_at:new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active', // Set default value for isActive
            status: true, // Set default value for status
        });

        const savedcategory = await newcategory.save();

        res.status(201).json(savedcategory);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error creating category", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Update category by ID (mark older as inactive, create new active one with a new category_id)
const updateCategoryById = async (req, res) => {
    const categoryId = req.params.categoryId;
    const updateData = req.body;

    try {
        // Find the existing category
        const existingcategory = await CategoryModel.findOne({ category_id: categoryId, isActive: "Active" });

        if (!existingcategory) {
            return res.status(404).json({ error: "category not found" });
        }
        // Mark all previous versions of the user as Inactive
        await CategoryModel.updateMany(
            { category_id: categoryId , isActive: "Active" },
            {
                $set: {
                    isActive: 'Inactive',
                    status: true,
                    expense_category_updated_by: {
                        admin_id: updateData.admin_id,
                        admin_name: updateData.admin_name
                    } || existingcategory.expense_category_created_by,
                    updated_at: new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30))
                }
            }
        );
        // Create a new category with the updated data and a new category_id
        const newcategory = new CategoryModel({
            category_id: categoryId,
            expense_category: updateData.expense_category || existingcategory.expense_category, // Use the updated expense_category or the existing one
            expense_category_created_by: {admin_id:updateData.admin_id,admin_name:updateData.admin_name} || existingcategory.expense_category_created_by,
            created_at : new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active',
            status: true,
        });

        const savednewcategory = await newcategory.save();

        res.status(200).json({
            message: "Category updated successfully",
            updatedCategory: savednewcategory,
        });
    } catch (error) {
        logErrorToFile(error);
        console.error("Error updating category by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


// Delete category by ID (mark as inactive)
const deleteCategoryById = async (req, res) => {
    const categoryId = req.params.categoryId;
    const { admin_id, admin_name , remarks} = req.body;
    const deldate = new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30))

    try {
        // Find the existing category
        const existingcategory = await CategoryModel.findOne({ category_id: categoryId , isActive:"Active" });

        if (!existingcategory) {
            return res.status(404).json({ error: "category not found" });
        }
        // Mark all previous versions of the user as Inactive
        // await CategoryModel.updateMany(
        //     { category_id: categoryId },
        //     { $set: { isActive: 'Inactive', status: false, deleted_at: new Date() } }
        // );

        // Mark the user as inactive and set the deleted type
        existingcategory.set({
            isActive: 'Inactive',
            status: false,
            expense_category_deleted_by: { admin_id, admin_name } || existingPayment.expense_category_created_by,
            remarks : remarks || "No remarks",
            deleted_at: deldate,
        });

        await existingcategory.save();
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        logErrorToFile(error);
        console.error("Error marking category as inactive by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

module.exports = {
    getAllCategory,
    getCategoryById,

    getActiveCategory,
    getInactiveCategory,
    getFalseStatusCategory,
    getActiveCategoryById,

    createCategory,
    updateCategoryById,
    deleteCategoryById,
};
