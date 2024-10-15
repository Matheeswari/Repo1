const mongoose = require("mongoose");
const { Schema } = mongoose;

const Customerschema = new Schema({ 
    customer_id: { type: String},
    customer_name: { type: String },
    customer_updated_name: { type: String }, // Updated customer name, if applicable
    customer_deleted_name: { type: String }, // Deleted name, if applicable
    phonenumber: { type: String},
    description: { type: String },
    updated_description: { type: String }, // Updated description, if applicable
    deleted_description: { type: String }, // Deleted description, if applicable
    remarks:String,
    customer_created_by: {
        admin_id:{ type: String },
        admin_name:{ type: String }
    },
    created_at: {
        type: Date
    },
    customer_updated_by:{
        admin_id:{ type: String },
        admin_name:{ type: String }
    },
    updated_at: {
        type: Date
    },
    customer_deleted_by:{
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
}, {
    suppressReservedKeysWarning: true
});

module.exports = mongoose.model("Customercollection", Customerschema);
