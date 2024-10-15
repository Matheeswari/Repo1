const ExpenseModel = require('../Models/Expensemaster');
const { logErrorToFile } = require('../ErrorLog');


// Function to generate a unique admin_id in the format "A01", "A02", etc.
const generateUniqueExpenseId = async () => {
    let counter = 1;
    let newExpenseId;

    do {
        // Pad the counter with leading zeros and concatenate with 'A'
        newExpenseId = `E${counter.toString().padStart(2, '0')}`;
        counter++;
    } while (await ExpenseModel.findOne({ expense_id: newExpenseId }));

    return newExpenseId;
};
// Get all expenses (active and inactive)
const getAllExpenses = async (req, res) => {
    try {
        const expenses = await ExpenseModel.find()
            .populate({
                path: 'expense_category', model: 'Categorycollection', select: 'expense_category'

            })
            .populate({
                path: 'spend_mode', model: 'Paymentcollection', select: 'payment_mode'

            })
            .populate([
                { path: 'expense_created_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_updated_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_deleted_by', model: 'Usercollection', select: 'name user_type' }
            ])
        res.status(200).json(expenses);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting expenses", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get active expenses
const getActiveExpenses = async (req, res) => {
    try {
        const activeExpenses = await ExpenseModel.find({ isActive: 'Active', status: true })
            .populate({
                path: 'expense_category', model: 'Categorycollection', select: 'expense_category'

            })
            .populate({
                path: 'spend_mode', model: 'Paymentcollection', select: 'payment_mode'

            })
            .populate([
                { path: 'expense_created_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_updated_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_deleted_by', model: 'Usercollection', select: 'name user_type' }
            ])
        res.status(200).json(activeExpenses);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active expenses", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get inactive expenses with status true
const getInactiveExpenses = async (req, res) => {
    try {
        const inactiveExpenses = await ExpenseModel.find({ isActive: 'Inactive', status: true })
            .populate({
                path: 'expense_category', model: 'Categorycollection', select: 'expense_category'

            })
            .populate({
                path: 'spend_mode', model: 'Paymentcollection', select: 'payment_mode'

            })
            .populate([
                { path: 'expense_created_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_updated_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_deleted_by', model: 'Usercollection', select: 'name user_type' }
            ])
        res.status(200).json(inactiveExpenses);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting inactive expenses", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get inactive expenses with status false
const getFalseStatusExpenses = async (req, res) => {
    try {
        const falseStatusExpenses = await ExpenseModel.find({ isActive: 'Inactive', status: false })
            .populate({
                path: 'expense_category', model: 'Categorycollection', select: 'expense_category'

            })
            .populate({
                path: 'spend_mode', model: 'Paymentcollection', select: 'payment_mode'

            })
            .populate([
                { path: 'expense_created_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_updated_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_deleted_by', model: 'Usercollection', select: 'name user_type' }
            ])
        res.status(200).json(falseStatusExpenses);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting expenses with false status", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get an expense by ID
const getExpenseById = async (req, res) => {
    const expenseId = req.params.expenseId;

    try {
        const expense = await ExpenseModel.find({ expense_id: expenseId })
            .populate({
                path: 'expense_category', model: 'Categorycollection', select: 'expense_category'

            })
            .populate({
                path: 'spend_mode', model: 'Paymentcollection', select: 'payment_mode'

            })
            .populate([
                { path: 'expense_created_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_updated_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_deleted_by', model: 'Usercollection', select: 'name user_type' }
            ])

        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.status(200).json(expense);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting expense by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get an active expense by ID
const getActiveExpenseById = async (req, res) => {
    const expenseId = req.params.expenseId;

    try {
        const activeExpense = await ExpenseModel.findOne({ expense_id: expenseId, isActive: 'Active', status: true })
            .populate({
                path: 'expense_category', model: 'Categorycollection', select: 'expense_category'

            })
            .populate({
                path: 'spend_mode', model: 'Paymentcollection', select: 'payment_mode'

            })
            .populate([
                { path: 'expense_created_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_updated_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_deleted_by', model: 'Usercollection', select: 'name user_type' }
            ])

        if (!activeExpense) {
            return res.status(404).json({ error: "Active Expense not found" });
        }

        res.status(200).json(activeExpense);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active expense by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


// Create a new expense with a dynamically generated expense_id
const createExpense = async (req, res) => {
    const { expense_date, expense_amount, attachment, category_id, category_expense, payment_id, payment_mode, admin_id, admin_name, } = req.body;

    try {
        // Generate a unique expense_id
        const newExpenseId = await generateUniqueExpenseId();

        // Create a new expense with the generated expense_id
        const newExpense = new ExpenseModel({
            expense_id: newExpenseId,
            expense_date,
            expense_category: { category_id, category_expense },
            expense_amount,
            spend_mode: { payment_id, payment_mode },
            attachment,
            expense_created_by: { admin_id, admin_name },
            created_at: new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active',
            status: true,
        });

        const savedExpense = await newExpense.save();

        res.status(201).json(savedExpense);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error creating expense", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
// Update expense by ID (mark older as inactive, create new active one with a new _id)
const updateExpenseById = async (req, res) => {
    const expenseId = req.params.expenseId;
    const updateData = req.body;

    try {
        // Find the existing expense
        const existingExpense = await ExpenseModel.findOne({ expense_id: expenseId ,isActive: "Active" });

        if (!existingExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }


        // Mark all previous versions of the user as Inactive
        await ExpenseModel.updateMany(
            { expense_id: expenseId , isActive: "Active" },
            { $set: {
                isActive: 'Inactive',
                status: true,
                expense_updated_by : {
                    admin_id: updateData.admin_id,
                    admin_name: updateData.admin_name
                } || existingPayment.expense_created_by,
                updated_at: new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30))
            } }
        );

        // Create a new expense with the updated data and a new expense_id
        const newExpense = new ExpenseModel({
            expense_id: expenseId,
            expense_date: updateData.expense_date || existingExpense.expense_date,
            expense_category: {
                category_id: updateData.category_id,
                category_expense: updateData.category_expense,
            } || existingExpense.expense_category,
            expense_amount: updateData.expense_amount || existingExpense.expense_amount,
            spend_mode: {
                payment_id: updateData.payment_id,
                payment_mode: updateData.payment_mode,
            } || existingExpense.spend_mode,
            attachment: updateData.attachment || existingExpense.attachment,
            expense_created_by: {
                admin_id: updateData.admin_id,
                admin_name: updateData.admin_name,
            } || existingPayment.payment_created_by,
            created_at : new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active',
            status: true,
        });

        const savedNewExpense = await newExpense.save();

        res.status(200).json({
            message: "Expense updated successfully",
            updatedUser: savedNewExpense,
        });
    } catch (error) {
        logErrorToFile(error);
        console.error("Error updating expense by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


// Delete expense by ID (mark as inactive)
const deleteExpenseById = async (req, res) => {
    const expenseId = req.params.expenseId;
    const { admin_id, admin_name , remarks } = req.body;
    const deldate = new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30))

    try {
        // Find the existing expense
        const existingExpense = await ExpenseModel.findOne({ expense_id: expenseId , isActive:"Active"  });

        if (!existingExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        
        // Mark all previous versions of the user as Inactive
        // await ExpenseModel.updateMany(
        //     { expense_id: expenseId },
        //     { $set: { isActive: 'Inactive', status: false, deleted_at: new Date() } }
        // );

        // Mark the user as inactive and set the deleted type
        existingExpense.set({
            isActive: 'Inactive',
            status: false,
            expense_deleted_by: { admin_id, admin_name } || existingExpense.expense_created_by,
            remarks : remarks || "No remarks",
            deleted_at: deldate,
        });
        existingExpense.save();

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        logErrorToFile(error);
        console.error("Error marking expense as inactive by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
// Get expenses by date
const expenseBydate = async (req, res) => {
    const date = req.params.date;

    try {
        const expensesByDate = await ExpenseModel.find({ expense_date: date })
            .populate({
                path: 'expense_category', model: 'Categorycollection', select: 'expense_category'

            })
            .populate({
                path: 'spend_mode', model: 'Paymentcollection', select: 'payment_mode'

            })
            .populate([
                { path: 'expense_created_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_updated_by', model: 'Usercollection', select: 'name user_type' },
                { path: 'expense_deleted_by', model: 'Usercollection', select: 'name user_type' }
            ]);

        if (!expensesByDate || expensesByDate.length === 0) {
            return res.status(404).json({ error: "No expenses found for the specified date" });
        }

        res.status(200).json(expensesByDate);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting expenses by date", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

const expensesByDateRange = async (req, res) => {

    try {
        const startDateString = req.params.startDate;
        const endDateString = req.params.endDate;

        const parsedStartDate = new Date(startDateString);
        const parsedEndDate = new Date(endDateString);

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const expensesInDateRange = await ExpenseModel.find({
            expense_date: { $gte: parsedStartDate, $lte: parsedEndDate },isActive:"Active",status:true}).sort({ expense_date: 'asc' });

        if (expensesInDateRange.length === 0) {
            return res.status(404).json({ error: 'No expenses found for the specified date range' });
        }

        res.status(200).json(expensesInDateRange);
    } catch (error) {
        logErrorToFile(error);
        console.error('Error getting expenses by date range', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const getexpenseBySearch = async (req, res) => {
    const key = req.body.key.toString();
    // let query = [{
    //     '$match': {
    //         'isActive': 'Active',
    //         'status': true,
    //         '$or': [
    //             {
    //                 'expense_category.category_expense': {
    //                     '$regex': key,
    //                     '$options': 'i'
    //                 }
    //             }, 
    //             {
    //                 'expense_created_by.admin_name': {
    //                     '$regex': key,
    //                     '$options': 'i'
    //                 }
    //             }
    //         ]
    //     }
    // }]
    let query = [
        {
            '$match': {
                'isActive': 'Active',
                'status': true,
                'expense_category.category_expense': {
                            '$regex': key,
                            '$options': 'i'
                        }    
        }
        }]
    await ExpenseModel.aggregate(query)
    .then((expense) => {
        if (expense.length > 0) {
            res.json(expense);   
        }
        else {
            res.json("Expense not available...");
        }
    
    }).catch((error) => {
        logErrorToFile(error);
        res.status(500).json({ error: "Error getting expense"+ err });
    });
}


module.exports = {
    getAllExpenses,
    getActiveExpenses,
    getInactiveExpenses,
    getFalseStatusExpenses,
    getExpenseById,
    getActiveExpenseById,
    createExpense,
    updateExpenseById,
    deleteExpenseById,
    expenseBydate,
    expensesByDateRange,
    getexpenseBySearch
};