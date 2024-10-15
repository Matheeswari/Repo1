const mongoose = require("mongoose");
const { Schema } = mongoose;

const Expenseschema = new Schema({
    expense_id: {
        type: String,
    },
    expense_date: { type: Date },

    expense_category: {
        category_id: { type: String },
        category_expense: { type: String }
    },

    expense_amount: { type: Number },
    
    spend_mode: {
        payment_id: { type: String },
        payment_mode: { type: String }
    },
    remarks:String,
    attachment: { type: String },
    
    expense_created_by: {
        admin_id: { type: String },
        admin_name: { type: String }
    },
    created_at: {
        type: Date
    },
    expense_updated_by: {
        admin_id: { type: String },
        admin_name: { type: String }
    },
    updated_at: {
        type: Date
    },
    expense_deleted_by: {
        admin_id: { type: String },
        admin_name: { type: String }
    },
    deleted_at: {
        type: Date
    },
    isActive: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    status: {
        type: Boolean,
        default: true
    }     
}, {
    suppressReservedKeysWarning: true
});

module.exports = mongoose.model("Expensecollection", Expenseschema);


