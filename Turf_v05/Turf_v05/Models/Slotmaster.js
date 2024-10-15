const mongoose = require("mongoose");
const { Schema } = mongoose;

const Slotschema = new Schema({
    booking_id: { type: String },
    b_date: { type: Date },
    slot_date: {type: Date},
    booking_customer_name: { type: String },
    booking_customer_phone: { type: String }, // Change to String if it's not a numeric value
    booking_customer_desc: { type: String },
    customer_id: { type: String },
    from_time: { type: Date },
    to_time: { type: Date },
    hours: { type: Number },
    total_amount: { type: Number },
    advance_received: { type: String },
    advance_amount_received: { type: Number },
    paid_amount: { type: Number },
    balance_amount: { type: Number },
    advance_received_by: {
        adv_admin_id: { type: String },
        adv_admin_name: { type: String }
    },
    advance_mode: {
        adv_payment_id: { type: String },
        adv_payment_mode: { type: String }
    },
    payment_details: [{
        pay_updated_date: { type: Date },
        pay_updated_by:{
            u_admin_id: { type: String },
            u_admin_name: { type: String }
        },
        total_amount: { type: Number },
        advance_amount_received: { type: Number },
        paid_amount: { type: Number },
        received_amount: { type: Number },
        balance_amount: { type: Number },
        payment_received_by: {
            p_admin_id: { type: String },
            p_admin_name: { type: String }
        },
        payment_mode: {
            payment_id: { type: String },
            payment_mode: { type: String }
        },
        payment_date: { type: Date },
        payment_isActive: {
            type: String,
            default: 'Active'
        },
    
        payment_status: {
            type: Boolean,
            default: true
        }
    }],

    slot_created_by: {
        sc_admin_id: { type: String },
        sc_admin_name: { type: String }
    },
    slot_updated_by: {
        su_admin_id: { type: String },
        su_admin_name: { type: String }
    },
    slot_deleted_by: {
        sd_admin_id: { type: String },
        sd_admin_name: { type: String }
    },

    created_at: { type: Date },
    updated_at: { type: Date },
    deleted_at: { type: Date },
    remarks:String,
    isActive: {
        type: String,
        default: 'Active'
    },

    status: {
        type: Boolean,
        default: true
    }
},
    {
        suppressReservedKeysWarning: true
    });

module.exports = mongoose.model("SlotBook", Slotschema);
