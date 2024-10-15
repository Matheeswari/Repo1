const mongoose = require("mongoose");
const { Schema } = mongoose;

const Paymentschema = new Schema({ 
    payment_id: { type: String },
    payment_mode: { 
        type: String,
        //enum: ['cash', 'credit_card', 'debit_card', 'online_transfer','bank_transfer'], 
    },
    
    payment_created_by: {
        admin_id:{ type: String },
        admin_name:{ type: String }
    },
    created_at: { type: Date},
    payment_updated_by: {
        admin_id:{ type: String },
        admin_name:{ type: String }
    }, 
    updated_at: { type: Date },
    payment_deleted_by: {
        admin_id:{ type: String },
        admin_name:{ type: String }
    },
    deleted_at:{ type: Date },
    isActive: { 
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    remarks:String,
    status: {
        type: Boolean,
        default: true
    }  
},
{
    suppressReservedKeysWarning: true
});

module.exports = mongoose.model("Paymentcollection", Paymentschema);
