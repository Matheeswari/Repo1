const mongoose = require("mongoose");
const { Schema } = mongoose;

const AdminSchema = new Schema({ 
    admin_id: { type: String },
    name: { type: String },
    password: { type: String },
    admin_created_by: {
    admin_id:{ type: String },
    admin_name:{ type: String }
    },
    remarks:String,
    created_at: {
        type: Date
    },
    admin_updated_by:{
        admin_id:{ type: String },
        admin_name:{ type: String }
        },
    updated_at: {
        type: Date
    },
    admin_deleted_by:{
        admin_id:{ type: String },
        admin_name:{ type: String }
    },
    deleted_at:{
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
    },
}, {
    suppressReservedKeysWarning: true
});

module.exports = mongoose.model("Admincollection", AdminSchema);
