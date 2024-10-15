const mongoose = require("mongoose");
const { Schema } = mongoose;

const Userschema = new Schema({ 
    user_id: { type: String },
    name: { type: String },
    username: { type: String },
    password: { type: String },
    user_type: { 
        type: String,
        enum: ['admin', 'user'], // Specify the allowed values for user_type by enum (enumeration)
    },
    // user_created_by: { type: mongoose.Types.ObjectId, ref: 'Adminmaster' },
    // user_updated_by: { type: mongoose.Types.ObjectId, ref: 'Adminmaster' },
    // user_deleted_by: { type: mongoose.Types.ObjectId, ref: 'Adminmaster' },
    user_created_by:{
        admin_id:{ type: String },
        admin_name:{ type: String }
    },
    created_at: { type: Date },
    user_updated_by:{
        admin_id:{ type: String },
        admin_name:{ type: String }
    },
    updated_at: { type: Date },
    user_deleted_by:{
        admin_id:{ type: String },
        admin_name:{ type: String }
    },
    remarks:String,
    deleted_at:{ type:Date },
    isActive: { 
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    status: {
        type: Boolean,
        default: true
    },
    
    
   
},
{
    suppressReservedKeysWarning: true
});

module.exports = mongoose.model("Usercollection", Userschema);
