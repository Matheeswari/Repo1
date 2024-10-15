const mongoose = require("mongoose");
const { Schema } = mongoose;

const Categoryschema = new Schema({
    category_id: { type: String },
    expense_category: {
        type: String,
        // enum: ['For Turf maintenance', 'For equipments', 'For Drinks', 'For essentials','For video recording'],
    },
    remarks:String,
    expense_category_created_by: {
        admin_id:{ type: String },
        admin_name:{ type: String }
    },
    created_at: {
        type: Date
    },
    expense_category_updated_by:{
        admin_id:{ type: String },
        admin_name:{ type: String }
    },
    updated_at: {
        type: Date
    },
    expense_category_deleted_by:{
        admin_id:{ type: String },
        admin_name:{ type: String }
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
},
{
    suppressReservedKeysWarning: true,
   
});

module.exports = mongoose.model("Categorycollection", Categoryschema);
