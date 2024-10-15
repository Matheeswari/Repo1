const SlotBookingModel = require('../Models/Slotmaster');
const CustomerModel = require('../Models/Customermaster')
const { logErrorToFile } = require('../ErrorLog');

// Function to generate a unique admin_id in the format "A01", "A02", etc.
const generateUniqueBookingId = async () => {
    let counter = 1;
    let uniqueBookingId;

    do {
        // Pad the counter with leading zeros and concatenate with 'A'
        uniqueBookingId = `Slot${counter.toString().padStart(2, '0')}`;
        counter++;
    } while (await SlotBookingModel.findOne({ booking_id: uniqueBookingId }));

    return uniqueBookingId;
};

// Function to generate a unique admin_id in the format "A01", "A02", etc.
const generateUniqueCustomerId = async () => {
    let counter = 1;
    let newCustomerId;

    do {
        // Pad the counter with leading zeros and concatenate with 'A'
        newCustomerId = `CS${counter.toString().padStart(2, '0')}`;
        counter++;
    } while (await CustomerModel.findOne({ customer_id: newCustomerId }));

    return newCustomerId;
};

const calculateHours = (fromTime, toTime) => {
    const ONE_HOUR = 60 * 60 * 1000; // milliseconds in an hour

    const fromTimestamp = new Date(fromTime).getTime();
    const toTimestamp = new Date(toTime).getTime();

    const hours = (toTimestamp - fromTimestamp) / ONE_HOUR;
    return hours;
};

// Check for overlapping slots
const checkOverlappingSlots = async (req, res) => {
    const { slot_date, from_time, to_time } = req.body;

    try {
        // Validate input parameters (you can add more validation as needed)

        // Check if there are any overlapping slots for the given date and time range
        const overlappingSlots = await SlotBookingModel.find({
            slot_date       ,
            "isActive": "Active",
            $or: [
                { from_time: { $lt: to_time, $gte: from_time } }, // Existing slot starts within the given range
                { to_time: { $gt: from_time, $lte: to_time } } // Existing slot ends within the given range
            ]
        });

        if (overlappingSlots.length > 0) {
            return res.status(400).json({ error: "Overlapping slots for the given date and time range", data: overlappingSlots });
        }

        // No overlapping slots
        res.status(200).json({ message: "No overlapping slots for the given date and time range" });
    } catch (error) {
        logErrorToFile(error);
        console.error("Error checking for overlapping slots", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get all slot bookings (active and inactive)
const getAllSlotBookings = async (req, res) => {
    try {
        const slotBookings = await SlotBookingModel.find()
            // .populate({
            //     path: 'c_id',
            //     model: 'Customercollection',
            //     select: 'customer_name'
            // })
            // .populate([
            //     { path: 'advance_received_by', model: 'Usercollection', select: 'name'},
            //     { path: 'advance_mode', model: 'Paymentcollection', select: 'payment_mode'},
            //     { path: 'slot_created_by', model: 'Admincollection', select: 'name' },
            //     { path: 'slot_created_by', model: 'Admincollection', select: 'name' },
            //     { path: 'slot_updated_by', model: 'Admincollection', select: 'name' },
            //     { path: 'slot_deleted_by', model: 'Admincollection', select: 'name' },
            //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
            //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
            //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
            // ]);
        res.status(200).json(slotBookings);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting slot bookings", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get a slot booking by ID
const getSlotBookingById = async (req, res) => {
    const bookingId = req.params.bookingId;

    try {
        const slotBooking = await SlotBookingModel.find({ booking_id : bookingId})
        // .populate({
        //     path: 'c_id',
        //     model: 'Customercollection',
        //     select: 'customer_name'
        // })
        // .populate([
        //     { path: 'advance_received_by', model: 'Usercollection', select: 'name'},
        //         { path: 'advance_mode', model: 'Paymentcollection', select: 'payment_mode'},
        //     { path: 'slot_created_by', model: 'Admincollection', select: 'name' },
        //     { path: 'slot_updated_by', model: 'Admincollection', select: 'name' },
        //     { path: 'slot_deleted_by', model: 'Admincollection', select: 'name' },
        //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
        //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
        // ]);

        if (!slotBooking) {
            return res.status(404).json({ error: "Slot booking not found" });
        }

        res.status(200).json(slotBooking);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting slot booking by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


const getActiveSlotBookings = async (req, res) => {
    try {
        const activeSlotBookings = await SlotBookingModel.find({ isActive: 'Active', status: true })
        // .populate({
        //     path: 'c_id',
        //     model: 'Customercollection',
        //     select: 'customer_name'
        // })
        // .populate([
        //     { path: 'advance_received_by', model: 'Usercollection', select: 'name'},
        //         { path: 'advance_mode', model: 'Paymentcollection', select: 'payment_mode'},
        //     { path: 'slot_created_by', model: 'Admincollection', select: 'name' },
        //     { path: 'slot_updated_by', model: 'Admincollection', select: 'name' },
        //     { path: 'slot_deleted_by', model: 'Admincollection', select: 'name' },
        //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
        //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
        // ]);
        res.status(200).json(activeSlotBookings);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active slot bookings", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getInactiveSlotBookings = async (req, res) => {
    try {
        const inactiveSlotBookings = await SlotBookingModel.find({ isActive: 'Inactive', status: true })
        // .populate({
        //     path: 'c_id',
        //     model: 'Customercollection',
        //     select: 'customer_name'
        // })
        // .populate([
        //     { path: 'advance_received_by', model: 'Usercollection', select: 'name'},
        //         { path: 'advance_mode', model: 'Paymentcollection', select: 'payment_mode'},
        //     { path: 'slot_created_by', model: 'Admincollection', select: 'name' },
        //     { path: 'slot_updated_by', model: 'Admincollection', select: 'name' },
        //     { path: 'slot_deleted_by', model: 'Admincollection', select: 'name' },
        //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
        //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
        // ]);
        res.status(200).json(inactiveSlotBookings);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting inactive slot bookings", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getFalseStatusSlotBookings = async (req, res) => {
    try {
        const falseStatusSlotBookings = await SlotBookingModel.find({ isActive: 'Inactive', status: false })
        // .populate({
        //     path: 'c_id',
        //     model: 'Customercollection',
        //     select: 'customer_name'
        // })
        // .populate([
        //     { path: 'advance_received_by', model: 'Usercollection', select: 'name'},
        //         { path: 'advance_mode', model: 'Paymentcollection', select: 'payment_mode'},
        //     { path: 'slot_created_by', model: 'Admincollection', select: 'name' },
        //     { path: 'slot_updated_by', model: 'Admincollection', select: 'name' },
        //     { path: 'slot_deleted_by', model: 'Admincollection', select: 'name' },
        //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
        //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
        // ]);
        res.status(200).json(falseStatusSlotBookings);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting slot bookings with false status", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};


const getActiveSlotBookingById = async (req, res) => {
    const bookingId = req.params.bookingId;

    try {
        const activeSlotBooking = await SlotBookingModel.find({ booking_id: bookingId, isActive: 'Active', status: true })
        // .populate({
        //     path: 'c_id',
        //     model: 'Customercollection',
        //     select: 'customer_name'
        // })
        // .populate([
        //     { path: 'advance_received_by', model: 'Usercollection', select: 'name'},
        //         { path: 'advance_mode', model: 'Paymentcollection', select: 'payment_mode'},
        //     { path: 'slot_created_by', model: 'Admincollection', select: 'name' },
        //     { path: 'slot_updated_by', model: 'Admincollection', select: 'name' },
        //     { path: 'slot_deleted_by', model: 'Admincollection', select: 'name' },
        //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
        //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
        // ]);
        if (!activeSlotBooking) {
            return res.status(404).json({ error: "Active Slot booking not found" });
        }

        res.status(200).json(activeSlotBooking);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting active slot booking by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Create a new slot booking with a dynamically generated booking_id and automatic hours calculation
// Function to create a new slot booking
const createSlotBooking = async (req, res) => {
    const { b_date,booking_customer_name, booking_customer_phone, booking_customer_desc, customer_id, from_time, to_time, adv_admin_id,adv_admin_name, sc_admin_id,sc_admin_name, total_amount, advance_received, advance_amount_received,adv_payment_id,adv_payment_mode} = req.body;

    try {

        // Check if the customer already exists in the customer collection
        let existingCustomer = await CustomerModel.findOne({ phonenumber:booking_customer_phone ,isActive:"Active",status:true});
       
        if(existingCustomer?.customer_name !== booking_customer_name && existingCustomer?.phonenumber==booking_customer_phone ){
            return res.status(400).json({error:"PhoneNumber exists with different UserName"})
        }

        if (!existingCustomer) {
            // Generate a unique c_id (if needed)
            const newCustomerId = await generateUniqueCustomerId();

            // If the customer doesn't exist, create a new customer entry
            const newCustomer = new CustomerModel({
                customer_id: newCustomerId,
                customer_name: booking_customer_name,
                phonenumber: booking_customer_phone,
                description: booking_customer_desc,
                customer_created_by: { admin_id:sc_admin_id, admin_name:sc_admin_name},
                created_at: new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30))

                // Add other customer-related fields as needed
            });

            existingCustomer = await newCustomer.save();
            console.log(existingCustomer);
        }

        const datetimeString = req.body.from_time;
        const slot_date = new Date(datetimeString).toISOString().split('T')[0];

        // Check if there are any overlapping slots for the given date and time range
        const overlappingSlots = await SlotBookingModel.find({
            slot_date,
            $or: [
                { from_time: { $lt: to_time, $gte: from_time } }, // Existing slot starts within the given range
                { to_time: { $gt: from_time, $lte: to_time } }, // Existing slot ends within the given range
                { 
                    from_time: { $gte: from_time }, 
                    to_time: { $lte: to_time } // Existing slot completely contains the given range
                },
                { 
                    from_time: { $lte: from_time }, 
                    to_time: { $gte: to_time } // Given range completely contains the existing slot
                }
            ]
            // $or: [
            //     {
            //         $and: [
            //             { from_time: { $lte: req.body.from_time } },
            //             { to_time: { $gt: req.body.from_time } }
            //         ]
            //     },
            //     {
            //         $and: [
            //             { from_time: { $lt: req.body.to_time } },
            //             { to_time: { $gte: req.body.to_time } }
            //         ]
            //     },
            //     {
            //         $and: [
            //             { from_time: { $gte: req.body.from_time } },
            //             { to_time: { $lte: req.body.to_time } }
            //         ]
            //     }
            // ]
        });

        if (overlappingSlots.length > 0) {
            return res.status(400).json({ error: "Overlapping slots for the given date and time range", data: overlappingSlots});
        }

        // Calculate hours based on from_time and to_time
        const hours = calculateHours(from_time, to_time);

        // Your logic to generate a unique booking_id
        const newBookingId = await generateUniqueBookingId();

        // Calculate balance_amount
        const balance_amount = total_amount - advance_amount_received;
        const paid_amount = advance_amount_received ;


        // Create a new slot booking with the provided details
        const newSlotBooking = new SlotBookingModel({
            booking_id: newBookingId,
            b_date: b_date || new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            slot_date,
            booking_customer_name,
            booking_customer_phone,
            booking_customer_desc,
            customer_id,
            from_time,
            to_time,
            hours,
            total_amount,
            advance_received,
            advance_amount_received,
            paid_amount,
            balance_amount,
            advance_received_by:{adv_admin_id,adv_admin_name},
            advance_mode:{adv_payment_id,adv_payment_mode},
            slot_created_by:{sc_admin_id,sc_admin_name},
            created_at:new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
            isActive: 'Active',
            status: true,
        });

        // Save the new slot booking to the database
        const savedSlotBooking = await newSlotBooking.save();

        // Send the saved slot booking as a response
        res.status(201).json(savedSlotBooking);
    } catch (error) {
        // Handle errors during the creation process
        logErrorToFile(error);
        console.error("Error creating slot booking", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const updateSlotpayById = async (req, res) => {
    const  bookingId  = req.params.bookingId;
    const { pay_updated_date, paying_amount,payment_date,p_admin_id,p_admin_name, payment_id,payment_mode, updated_total_amount,u_admin_id,u_admin_name} = req.body;

    try {
        const slotBooking = await SlotBookingModel.findOne({ booking_id: bookingId, isActive: 'Active', status: true  });
        
        if (!slotBooking) {
            return res.status(404).json({ error: "Slot booking not found" });
        }
    
        // Mark the previous payment details as inactive
        if (slotBooking.payment_details.length > 0 && slotBooking.payment_details[slotBooking.payment_details.length - 1].balance_amount !== 0)
         {
                slotBooking.payment_details.forEach((payment) => {
                payment.payment_isActive = 'Inactive';
                payment.payment_status = true;
            });
        }
    
        // Save the slotBooking with the updated payment details
        await slotBooking.save();
    
        // Update total_amount directly if updated_total_amount is provided
        let updatedTotalAmount = updated_total_amount !== undefined ? updated_total_amount : slotBooking.total_amount;
    

        // Calculate total received amount from all payments
        const totalReceived = slotBooking.payment_details.reduce((sum, payment) => sum + payment.received_amount, 0);

        // Calculate the balance amount based on total_amount, advance_amount, and total received
        let balanceAmount = updatedTotalAmount - slotBooking.advance_amount_received - totalReceived ;
        let updated_paid_amount = 0;
        if(req.body.paying_amount){
        if (balanceAmount !== 0){
        // Calculate the paid amount based on total_amount, advance_amount, and balance_amount
        updated_paid_amount = slotBooking.advance_amount_received + totalReceived + req.body.paying_amount;
        console.log(updated_paid_amount);
        }
        }
        // Check if the balance amount will be negative
        if (balanceAmount < 0) {
            return res.status(400).json({ error: "No need payment" });
        }
        // Check if the balance amount is already 0
        if (balanceAmount === 0) {
            return res.status(400).json({ error: "No need for additional payment. Balance amount is already 0." });
        }
        // Get the current date and time
        const paymentDateTime = new Date();
        const autopayuploadedTime = new Date();
        autopayuploadedTime.setHours(autopayuploadedTime.getHours() + 5);
        autopayuploadedTime.setMinutes(autopayuploadedTime.getMinutes() + 30);
        // Update the payment details array
        const newPaymentDetail = {
            pay_updated_date: pay_updated_date || autopayuploadedTime,
            pay_updated_by:{
                u_admin_id:u_admin_id,
                u_admin_name:u_admin_name
            },
            total_amount: updatedTotalAmount,
            paid_amount: (slotBooking.payment_details.length > 0)
                ? slotBooking.payment_details[slotBooking.payment_details.length - 1].paid_amount + paying_amount
                : paying_amount + slotBooking.advance_amount_received,
            received_amount: paying_amount,  // Set received_amount to paying_amount
            balance_amount: updatedTotalAmount - ((slotBooking.payment_details.length > 0)
                ? slotBooking.payment_details[slotBooking.payment_details.length - 1].paid_amount + paying_amount
                : paying_amount + slotBooking.advance_amount_received),
            payment_received_by: {p_admin_id,p_admin_name},
            payment_mode: {payment_id,payment_mode},
            payment_date: payment_date||paymentDateTime,
        };

        // Push the new payment detail into the payment_details array
    slotBooking.payment_details.push(newPaymentDetail);

    // Update the balance_amount and total_amount in the slot booking itself
    slotBooking.balance_amount = updatedTotalAmount - ((slotBooking.payment_details.length > 0)
        ? slotBooking.payment_details[slotBooking.payment_details.length - 1].paid_amount
        : slotBooking.advance_amount_received);
    slotBooking.total_amount = updatedTotalAmount;
    slotBooking.paid_amount = updated_paid_amount;
    console.log(slotBooking.paid_amount);

        // Check if the balance amount will be negative
        if (slotBooking.balance_amount < 0) {
            return res.status(400).json({ error: "Cannot update payment. Paid amount exceeds the total balance." });
        }

    // Save the updated slot booking
    const updatedSlotBooking = await slotBooking.save();

        // Send the updated slot booking as a response
        res.status(200).json({
             message: "Slot Payment details updated successfully",
             updatedSlotBooking :updatedSlotBooking});
    }
    catch (error) {
        // Handle errors during the update process
        logErrorToFile(error);
        console.error("Error updating slot booking", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// const updateSlotById = async (req, res) => {
//     const bookingId = req.params.bookingId;
//     const {
//         b_date,
//         booking_customer_name,
//         booking_customer_phone,
//         booking_customer_desc,
//         customer_id,
//         from_time,
//         to_time,
//         total_amount,
//         advance_received,
//         advance_amount_received,
//         admin_id,
//         admin_name,
//         payment_id,
//         payment_mode,
//         u_admin_id,
//         u_admin_name
//     } = req.body;

//     try {
//         const slotBooking = await SlotBookingModel.findOne({ booking_id: bookingId });

//         if (!slotBooking) {
//             return res.status(404).json({ error: "Slot booking not found" });
//         }
//         // Mark all previous versions of the user as Inactive
//         await SlotBookingModel.updateMany(
//             { booking_id: bookingId },
//             { $set: { isActive: 'Inactive', status: true, updated_at: new Date() } }
//         );

//         // Update the fields with provided values
//         if (b_date) slotBooking.b_date = b_date;
//         if (booking_customer_name) slotBooking.booking_customer_name = booking_customer_name;
//         if (booking_customer_phone) slotBooking.booking_customer_phone = booking_customer_phone;
//         if (booking_customer_desc) slotBooking.booking_customer_desc = booking_customer_desc;
//         if (customer_id) slotBooking.customer_id = customer_id;
//         if (from_time) slotBooking.from_time = from_time;
//         if (to_time) slotBooking.to_time = to_time;
//         if (total_amount) slotBooking.total_amount = total_amount;
//         if (advance_received !== undefined) slotBooking.advance_received = advance_received;
//         if (advance_amount_received) slotBooking.advance_amount_received = advance_amount_received;
//         if (admin_id && admin_name) slotBooking.advance_received_by = { admin_id, admin_name };
//         if (payment_id && payment_mode) slotBooking.advance_mode = { payment_id, payment_mode };
//         if (u_admin_id && u_admin_name) slotBooking.slot_updated_by = { u_admin_id, u_admin_name };
//         // Your logic for calculating hours

//         // Save the updated slot booking
//         const updatedSlotBooking = await slotBooking.save();

//         // Create a copy of the updated slot booking object without balance_amount
//         const sanitizedSlotBooking = { ...updatedSlotBooking.toObject(), balance_amount: undefined };
        
//         // Send the updated slot booking as a response
//         res.status(200).json({
//             message: "Booking updated successfully",
//             updatedSlotBooking: sanitizedSlotBooking
//         });
//     } catch (error) {
//         // Handle errors during the update process
//         console.error("Error updating slot booking", error);
//         res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// };


const updateSlotById = async (req, res) => {
    try {
      const { bookingId } = req.params;
      const {
        b_date,
        slot_date,
        booking_customer_name,
        booking_customer_phone,
        booking_customer_desc,
        customer_id,
        extending_from_time,
        extending_to_time,
        total_amount,
        advance_received,
        advance_amount_received,
        adv_admin_id,
        adv_admin_name,
        adv_payment_id,
        adv_payment_mode,
        su_admin_id,
        su_admin_name,
      } = req.body;
  
      // Build the update object based on the fields you want to update
      const updateObject = {};
      if (b_date) updateObject.b_date = b_date;
      if (slot_date) updateObject.slot_date = slot_date;
      if (booking_customer_name) updateObject.booking_customer_name = booking_customer_name;
      if (booking_customer_phone) updateObject.booking_customer_phone = booking_customer_phone;
      if (booking_customer_desc) updateObject.booking_customer_desc = booking_customer_desc;
      if (customer_id) updateObject.customer_id = customer_id;
      if (extending_from_time) updateObject.extending_from_time = extending_from_time;
      if (extending_to_time) updateObject.extending_to_time = extending_to_time;
      if (total_amount) updateObject.total_amount = total_amount;
      if (advance_received) updateObject.advance_received = advance_received;
      if (advance_amount_received) updateObject.advance_amount_received = advance_amount_received;
      if (adv_admin_id) updateObject.adv_admin_id = adv_admin_id;
      if (adv_admin_name) updateObject.adv_admin_name = adv_admin_name;
      if (adv_payment_id) updateObject.adv_payment_id = adv_payment_id;
      if (adv_payment_mode) updateObject.adv_payment_mode = adv_payment_mode;
      if (su_admin_id) updateObject.su_admin_id = su_admin_id;
      if (su_admin_name) updateObject.su_admin_name = su_admin_name;
  
      // Check if there are any overlapping slots for the given date and time range
      const overlappingSlots = await SlotBookingModel.find({
        b_date,
        $and: [
          {
            $or: [
              { from_time: { $lt: extending_to_time } },
              { to_time: { $gt: extending_from_time } },
            ],
          },
          { booking_id: { $ne: bookingId } }, // Exclude the current booking from the check
          { isActive: 'Active', status: true },
        ],
      });
  
      if (overlappingSlots.length > 0) {
        return res.status(400).json({ error: 'Overlapping slots for the given date and time range' });
      }
  
      // Find the existing slot with isActive: Active and status: true
const existingSlotBooking = await SlotBookingModel.findOne({ booking_id: bookingId, isActive: 'Active', status: true });

if (!existingSlotBooking) {
  return res.status(404).json({ error: 'Slot booking not found' });
}

// Mark all previous versions of the slot as Inactive and set their status to true
await SlotBookingModel.updateMany(
  { booking_id: bookingId, isActive: 'Active', status: true },
  { $set: { isActive: 'Inactive', status: true } }
);
  
      // Use existing values if not provided in the update
      updateObject.from_time = updateObject.extending_from_time || existingSlotBooking.from_time;
      updateObject.to_time = updateObject.extending_to_time || existingSlotBooking.to_time;
  
      // Calculate hours based on from_time and to_time
      const hours = calculateHours(updateObject.from_time, updateObject.to_time);
  
      // Calculate balance_amount

      updateObject.balance_amount = (updateObject.total_amount || existingSlotBooking.total_amount) - (updateObject.advance_amount_received || existingSlotBooking.advance_amount_received);
  
      updateObject.slot_updated_by = {
        su_admin_id:( su_admin_id || existingSlotBooking.su_admin_id ),
    su_admin_name:( su_admin_name || existingSlotBooking.su_admin_name ), 
    };

      //advance
    //   updateObject.advance_received_by = {adv_admin_id,adv_admin_name};
    //   slot_updated_by={su_admin_id,su_admin_name};
    //   advance_mode:{adv_payment_id,adv_payment_mode},
      //slot_updated_by
    //   su_admin_id = updateObject.su_admin_id || existingSlotBooking.su_admin_id;
    //   su_admin_name = updateObject.su_admin_name || existingSlotBooking.su_admin_name;
    
      // Create a new instance of the Mongoose model
      const updatedSlotBooking = new SlotBookingModel({
        booking_id: bookingId,
        ...updateObject,
        b_date: updateObject.b_date || existingSlotBooking.b_date,
        slot_date: updateObject.slot_date || existingSlotBooking.slot_date,
        booking_customer_name: updateObject.booking_customer_name || existingSlotBooking.booking_customer_name,
        booking_customer_phone: updateObject.booking_customer_phone || existingSlotBooking.booking_customer_phone, // Ensure it has a key
        booking_customer_desc: updateObject.booking_customer_desc || existingSlotBooking.booking_customer_desc,
        customer_id: updateObject.customer_id || existingSlotBooking.customer_id,
        from_time: updateObject.from_time || existingSlotBooking.from_time,
        to_time: updateObject.to_time || existingSlotBooking.to_time,
        hours,
        total_amount: updateObject.total_amount || existingSlotBooking.total_amount,
        advance_received: updateObject.advance_received || existingSlotBooking.advance_received,
        advance_amount_received: updateObject.advance_amount_received || existingSlotBooking.advance_amount_received,
        advance_received_by: {
            adv_admin_id: updateObject.adv_admin_id || existingSlotBooking.advance_received_by.adv_admin_id,
            adv_admin_name: updateObject.adv_admin_name || existingSlotBooking.advance_received_by.adv_admin_name
        },
        advance_mode: updateObject.advance_mode || existingSlotBooking.advance_mode,
        balance_amount: updateObject.balance_amount || (existingSlotBooking.total_amount - existingSlotBooking.advance_amount_received),
        slot_created_by: existingSlotBooking.slot_created_by,
        slot_updated_by: {
            su_admin_id: updateObject.su_admin_id || existingSlotBooking.slot_updated_by.su_admin_id || existingSlotBooking.slot_created_by.sc_admin_id,
            su_admin_name: updateObject.su_admin_name || existingSlotBooking.slot_updated_by.su_admin_name || existingSlotBooking.slot_created_by.sc_admin_name,
        },    
        payment_details: existingSlotBooking.payment_details,
        created_at: existingSlotBooking.created_at,
        updated_at: req.body.updated_at || new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
        isActive: 'Active',
        status: 'true',
    });
    
  
      // Save the updated slot booking
      await updatedSlotBooking.save();
  
      // Send the updated slot booking as a response
res.status(200).json({
    message: 'Slot details updated successfully',
    updatedSlotBooking: updatedSlotBooking,  // Convert Mongoose document to plain JavaScript object
  });
  
    } catch (error) {
      // Handle errors during the update process
      logErrorToFile(error);
      console.error('Error updating slot booking', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  };

const deleteSlotBookingById = async (req, res) => {
    const bookingId = req.params.bookingId;
    const { admin_id, admin_name , remarks} = req.body;
    try {
        const existingBooking = await SlotBookingModel.findOne({booking_id : bookingId})

        if (!existingBooking) {
            return res.status(404).json({ error: "Booking not found" });
        }

         // Mark all previous versions of the user as Inactive
        await SlotBookingModel.updateMany(
            { booking_id: bookingId },
            { $set: { isActive: 'Inactive', status: false, deleted_at: new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)) } }
            );

        // Mark the user as inactive and set the deleted type
        existingBooking.set({
            isActive: 'Inactive',
            status: false,
            slot_deleted_by: { admin_id, admin_name } || existingBooking.slot_created_by,
            remarks : remarks || "No remarks",
            deleted_at:new Date(new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)),
        });
        await existingBooking.save();

        res.status(200).json({ message: "Booking deleted successfully"});
    } catch (error) {
        logErrorToFile(error);
        console.error("Error deleting slot booking by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// const getPaymentsByUpdatedDatewise = async (req, res) => {
//     const { date } = req.params;

//     try {
//         // Validate that date is provided
//         if (!date) {
//             return res.status(400).json({ error: "The date parameter is required" });
//         }

//         // Parse the provided date string into a Date object
//         const parsedDate = new Date(`${date}T00:00:00Z`);  // Set the time to start of the day

//         // Check if the date is valid
//         if (isNaN(parsedDate.getTime())) {
//             return res.status(400).json({ error: "Invalid date format" });
//         }

//         // Calculate the end of the day by adding 1 day and subtracting 1 millisecond
//         const endOfDay = new Date(parsedDate);
//         endOfDay.setDate(endOfDay.getDate() + 1);
//         endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 1);

//         // Query the database for slot bookings with payment details within the specified date
//         const paymentDetailsByDate = await SlotBookingModel.find({
//             "payment_details.pay_updated_date": {
//                 $gte: parsedDate,
//                 $lt: endOfDay,
//             },
//             "isActive": "Active"
//         })
//         // .select('b_date booking_customer_name booking_customer_phone payment_details')  // Project only the payment_details field
//         // .populate([
//         //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
//         //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
//         // ]);

//         res.status(200).json(paymentDetailsByDate);
//     } catch (error) {
//         console.error("Error getting payment details by date", error);
//         res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// };

const getPaymentsByUpdatedDatewise = async (req, res) => {
    const { date } = req.params;

    try {
        // Validate that date is provided
        if (!date) {
            return res.status(400).json({ error: "The date parameter is required" });
        }

        // Parse the provided date string into a Date object
        const parsedDate = new Date(`${date}T00:00:00Z`);  // Set the time to start of the day

        // Check if the date is valid
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        // Calculate the end of the day by adding 1 day and subtracting 1 millisecond
        const endOfDay = new Date(parsedDate);
        endOfDay.setDate(endOfDay.getDate() + 1);
        endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 1);

 // Query the database for slot bookings with payment details within the specified date
const bookings = await SlotBookingModel.find({
    "payment_details.pay_updated_date": {
        $gte: parsedDate,
        $lt: endOfDay,
    }})

// Extract the specific payment within each booking's payment_details array based on the date
const extractedPayments = bookings.map(booking => {
    const payment = booking.payment_details.find(payment => {
        const paymentDate = new Date(payment.pay_updated_date);
        return paymentDate >= parsedDate && paymentDate < endOfDay;
    });

    return {
        booking_id:booking.booking_id ,
        b_date:booking.b_date ,
        slot_date:booking.slot_date ,
        booking_customer_name:booking.booking_customer_name ,
        booking_customer_phone:booking.booking_customer_phone,
        booking_customer_des:booking.booking_customer_des ,
        from_time: booking.from_time,
        to_time:booking.to_time,
        hours:booking.hours,
        total_amount:booking.total_amount ,
        advance_received:booking.advance_received ,
        advance_amount_received:booking.advance_amount_received ,
        balance_amount:booking.balance_amount ,
        payment: payment || null, // If no payment found for the date, return null
        updated_at:booking.updated_at ,
        advance_received_by: booking.advance_received_by,
        advance_mode:booking.advance_mode ,
        slot_created_by:booking.slot_created_by,
        slot_updated_by:booking.slot_updated_by ,
        _id:booking._id ,
        isActive:booking.isActive ,
        status:booking.status ,
         __v:booking.__v 
        
    };
});

res.status(200).json(extractedPayments);
} 
catch (error) {
logErrorToFile(error);
console.error("Error getting payment details by date", error);
res.status(500).json({ error: "Internal Server Error", details: error.message });
}
};

// const getPaymentsByPaidDatewise = async (req, res) => {
//     const { date } = req.params;

//     try {
//         // Validate that date is provided
//         if (!date) {
//             return res.status(400).json({ error: "The date parameter is required" });
//         }

//         // Parse the provided date string into a Date object
//         const parsedDate = new Date(`${date}T00:00:00Z`);  // Set the time to start of the day

//         // Check if the date is valid
//         if (isNaN(parsedDate.getTime())) {
//             return res.status(400).json({ error: "Invalid date format" });
//         }

//         // Calculate the end of the day by adding 1 day and subtracting 1 millisecond
//         const endOfDay = new Date(parsedDate);
//         endOfDay.setDate(endOfDay.getDate() + 1);
//         endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 1);

//         // Query the database for slot bookings with payment details within the specified date
//         const paymentDetailsByDate = await SlotBookingModel.find({
//             "payment_details.payment_date": {
//                 $gte: parsedDate,
//                 $lt: endOfDay,
//             },
//             "isActive": "Active"
//         })
//         // .select('b_date booking_customer_name booking_customer_phone payment_details')  // Project only the payment_details field
//         // .populate([
//         //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
//         //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
//         // ]);

//         res.status(200).json(paymentDetailsByDate);
//     } catch (error) {
//         console.error("Error getting payment details by date", error);
//         res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// };

// Controller to get payment details by date
const getPaymentsByPaidDatewise = async (req, res) => {
    const { date } = req.params;

    try {
        // Validate that date is provided
        if (!date) {
            return res.status(400).json({ error: "The date parameter is required" });
        }

        // Parse the provided date string into a Date object
        const parsedDate = new Date(`${date}T00:00:00Z`);  // Set the time to start of the day

        // Check if the date is valid
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        // Calculate the end of the day by adding 1 day and subtracting 1 millisecond
        const endOfDay = new Date(parsedDate);
        endOfDay.setDate(endOfDay.getDate() + 1);
        endOfDay.setMilliseconds(endOfDay.getMilliseconds() - 1);

 // Query the database for slot bookings with payment details within the specified date
const bookings = await SlotBookingModel.find({
    "payment_details.payment_date": {
        $gte: parsedDate,
        $lt: endOfDay,
    }})

// Extract the specific payment within each booking's payment_details array based on the date
const extractedPayments = bookings.map(booking => {
    const payment = booking.payment_details.find(payment => {
        const paymentDate = new Date(payment.payment_date);
        return paymentDate >= parsedDate && paymentDate < endOfDay;
    });

    return {
        booking_id:booking.booking_id ,
        b_date:booking.b_date ,
        slot_date:booking.slot_date ,
        booking_customer_name:booking.booking_customer_name ,
        booking_customer_phone:booking.booking_customer_phone,
        booking_customer_des:booking.booking_customer_des ,
        from_time: booking.from_time,
        to_time:booking.to_time,
        hours:booking.hours,
        total_amount:booking.total_amount ,
        advance_received:booking.advance_received ,
        advance_amount_received:booking.advance_amount_received ,
        balance_amount:booking.balance_amount ,
        payment: payment || null, // If no payment found for the date, return null
        updated_at:booking.updated_at ,
        advance_received_by: booking.advance_received_by,
        advance_mode:booking.advance_mode ,
        slot_created_by:booking.slot_created_by,
        slot_updated_by:booking.slot_updated_by ,
        _id:booking._id ,
        isActive:booking.isActive ,
        status:booking.status ,
        __v:booking.__v 
    };
});

res.status(200).json(extractedPayments);
} catch (error) {
logErrorToFile(error);
console.error("Error getting payment details by date", error);
res.status(500).json({ error: "Internal Server Error", details: error.message });
}
};


const getPaymentsByUpdatedDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        // Validate that startDate and endDate are provided
        if (!startDate || !endDate) {
            return res.status(400).json({ error: "Both startDate and endDate are required parameters" });
        }

        // Parse the provided date strings into Date objects
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        // Check if the dates are valid
        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        // Adjust endDate to include the entire day
        parsedEndDate.setHours(23, 59, 59, 999);

        // Query the database for slot bookings with payment details within the specified date range
        const bookings = await SlotBookingModel.find({
            "payment_details.pay_updated_date": {
                $gte: parsedStartDate,
                $lte: parsedEndDate,
            }
        })
        
        // Extract the specific payment within each booking's payment_details array based on the date
        const extractedPayments = bookings.map(booking => {
            const paymentDetails = booking.payment_details || [];
            const paymentsInRange = paymentDetails.filter(payment => {
                const paymentDate = new Date(payment.pay_updated_date);
                return paymentDate >= parsedStartDate && paymentDate <= parsedEndDate;
            });

    return {
        booking_id:booking.booking_id ,
        b_date:booking.b_date ,
        slot_date:booking.slot_date ,
        booking_customer_name:booking.booking_customer_name ,
        booking_customer_phone:booking.booking_customer_phone,
        booking_customer_des:booking.booking_customer_des ,
        from_time: booking.from_time,
        to_time:booking.to_time,
        hours:booking.hours,
        total_amount:booking.total_amount ,
        advance_received:booking.advance_received ,
        advance_amount_received:booking.advance_amount_received ,
        balance_amount:booking.balance_amount ,
        payment: paymentsInRange || null, // If no payment found for the date, return null
        updated_at:booking.updated_at ,
        advance_received_by: booking.advance_received_by,
        advance_mode:booking.advance_mode ,
        slot_created_by:booking.slot_created_by,
        slot_updated_by:booking.slot_updated_by ,
        _id:booking._id ,
        isActive:booking.isActive ,
        status:booking.status ,
         __v:booking.__v 
        
    };
});

res.status(200).json(extractedPayments);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting payment details by date", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getPaymentsByPaidDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        // Validate that startDate and endDate are provided
        if (!startDate || !endDate) {
            return res.status(400).json({ error: "Both startDate and endDate are required parameters" });
        }

        // Parse the provided date strings into Date objects
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        // Check if the dates are valid
        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        // Adjust endDate to include the entire day
        parsedEndDate.setHours(23, 59, 59, 999);

        // Query the database for slot bookings with payment details within the specified date range
        const bookings = await SlotBookingModel.find({
            "payment_details.payment_date": {
                $gte: parsedStartDate,
                $lte: parsedEndDate,
            }
        })
        
        // Extract the specific payment within each booking's payment_details array based on the date
        const extractedPayments = bookings.map(booking => {
            const paymentDetails = booking.payment_details || [];
            const paymentsInRange = paymentDetails.filter(payment => {
                const paymentDate = new Date(payment.payment_date);
                return paymentDate >= parsedStartDate && paymentDate <= parsedEndDate;
            });

    return {
        booking_id:booking.booking_id ,
        b_date:booking.b_date ,
        slot_date:booking.slot_date ,
        booking_customer_name:booking.booking_customer_name ,
        booking_customer_phone:booking.booking_customer_phone,
        booking_customer_des:booking.booking_customer_des ,
        from_time: booking.from_time,
        to_time:booking.to_time,
        hours:booking.hours,
        total_amount:booking.total_amount ,
        advance_received:booking.advance_received ,
        advance_amount_received:booking.advance_amount_received ,
        balance_amount:booking.balance_amount ,
        payment: paymentsInRange || null, // If no payment found for the date, return null
        updated_at:booking.updated_at ,
        advance_received_by: booking.advance_received_by,
        advance_mode:booking.advance_mode ,
        slot_created_by:booking.slot_created_by,
        slot_updated_by:booking.slot_updated_by ,
        _id:booking._id ,
        isActive:booking.isActive ,
        status:booking.status ,
         __v:booking.__v 
        
    };
});

res.status(200).json(extractedPayments);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting payment details by date", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getSlotBookingsByBookingDate = async (req, res) => {

    const date = new Date(`${req.params.date}T00:00:00Z`);
    try {
        const slotBookingsByDate = await SlotBookingModel.find({ b_date: date,isActive:"Active"})
        // .populate({
        //     path: 'c_id',
        //     model: 'Customercollection',
        //     select: 'customer_name'
        // })
        // .populate([
        //     { path: 'advance_received_by', model: 'Usercollection', select: 'name'},
        //     { path: 'advance_mode', model: 'Paymentcollection', select: 'payment_mode'},
        //     { path: 'slot_created_by', model: 'Admincollection', select: 'name' },
        //     { path: 'slot_updated_by', model: 'Admincollection', select: 'name' },
        //     { path: 'slot_deleted_by', model: 'Admincollection', select: 'name' },
        //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
        //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
        //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
        // ]);
        
        res.status(200).json(slotBookingsByDate);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting slot bookings by date", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getSlotBookingsBySlotDate = async (req, res) => {

    const date = new Date(`${req.params.date}T00:00:00Z`);
    try {
        const slotBookingsByDate = await SlotBookingModel.find({ slot_date: date,isActive:"Active"})
        
        res.status(200).json(slotBookingsByDate);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting slot bookings by date", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getSlotWithPendingBalance =async (req, res) => {
    try {
        const slotBookingsWithPendingBalance = await SlotBookingModel.find({
            "balance_amount": { $gt: 0 },
            isActive:"Active"
        })
        // .select('b_date booking_customer_name booking_customer_phone balance_amount')

        res.status(200).json(slotBookingsWithPendingBalance);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error fetching slot bookings with pending balance", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

const getSlotBookingsByBookingRange = async (req, res) => {

    try {
        const startDateString = req.params.startDate;
        const endDateString = req.params.endDate;

        const parsedStartDate = new Date(startDateString);
        const parsedEndDate = new Date(endDateString);

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const expensesInDateRange = await SlotBookingModel.find({
            b_date: { $gte: parsedStartDate, $lte: parsedEndDate },
            isActive:"Active"
        });

        if (expensesInDateRange.length === 0) {
            return res.status(404).json({ error: 'No slots found for the specified date range' });
        }

        res.status(200).json(expensesInDateRange);
    } catch (error) {
        logErrorToFile(error);
        console.error('Error getting slots by date range', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const getSlotBookingsBySlotRange = async (req, res) => {

    try {
        const startDateString = req.params.startDate;
        const endDateString = req.params.endDate;

        const parsedStartDate = new Date(startDateString);
        const parsedEndDate = new Date(endDateString);

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const expensesInDateRange = await SlotBookingModel.find({
            slot_date: { $gte: parsedStartDate, $lte: parsedEndDate },
            isActive:"Active"
        });

        if (expensesInDateRange.length === 0) {
            return res.status(404).json({ error: 'No slots found for the specified date range' });
        }

        res.status(200).json(expensesInDateRange);
    } catch (error) {
        logErrorToFile(error);
        console.error('Error getting slots by date range', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

const getwithoutpaymentById = async (req, res) => {
    const bookingId = req.params.bookingId;

    try {
        const slotBooking = await SlotBookingModel.find({ booking_id: bookingId, isActive:"Active"})
            .select('-payment_details')  // Exclude the payment_details field

        if (!slotBooking) {
            return res.status(404).json({ error: "Slot booking not found" });
        }

        res.status(200).json(slotBooking);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting slot details by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getallwithoutpayment = async (req, res) => {

    try {
        const slotBooking = await SlotBookingModel.find({isActive:"Active"})
            .select('-payment_details')  // Exclude the payment_details field

        if (!slotBooking) {
            return res.status(404).json({ error: "Slot booking not found" });
        }

        res.status(200).json(slotBooking);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting slot details by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
const getallpayment = async (req, res) => {

    try {
        const slotBooking = await SlotBookingModel.find({ isActive:"Active" })
        .select('booking_id')
        .select('payment_details')  // Exclude the payment_details field

        if (!slotBooking) {
            return res.status(404).json({ error: "Slot booking not found" });
        }

        res.status(200).json(slotBooking);
    } catch (error) {
        logErrorToFile(error);
        console.error("Error getting slot details by ID", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const getSlotBySearch = async (req, res) => {
    const key = req.body.key
    let query = [
        {
            '$match': {
                'isActive': 'Active',
                'status': true,
                '$or': [
                    {
                        'booking_customer_name': {
                            '$regex': key,
                            '$options': 'i'
                        }
                    }, {
                        'booking_customer_phone': {
                            '$regex': key,
                            '$options': 'i'
                        }
                    }
                ]
            }
        }
    ];
    await SlotBookingModel.aggregate(query)
    .then((slot) => {
        if (slot != null) {
            res.json(slot);   
        }
        else {
            res.send("Slot not available...");
        }
    
    }).catch((error) => {
        logErrorToFile(error);
        res.status(500).json({ error: "Error getting slot"+ err });
    });
}

// const paymentreport = async (req, res) => {
//     try {
//       const updatedSlotBookings = await SlotBookingModel.find({ isActive: 'Active', status: true });
  
//       // Function to calculate total amount for all payment modes
//       const calculateTotalAmountsForAllPaymentModes = (bookingData) => {
//         const totalAmounts = {};
  
//         // Iterate through each booking data
//         bookingData.forEach((booking) => {
//           // Check if payment_details is defined and is an array
//           if (booking.payment_details && Array.isArray(booking.payment_details)) {
//             // Iterate through payment_details array
//             booking.payment_details.forEach((payment) => {
//               const paymentMode = payment.payment_mode.payment_mode;
  
//               // Add the total_amount for the payment mode to the totalAmounts object
//               totalAmounts[paymentMode] = (totalAmounts[paymentMode] || 0) + payment.received_amount;
//             });
//           }
//         });
  
//         return totalAmounts;
//       };
  
//       // Calculate total amounts for all payment modes
//       const totalAmountsForAllPaymentModes = calculateTotalAmountsForAllPaymentModes(updatedSlotBookings);
  
//       // Display the total amounts for all payment modes
//       console.log("Total amounts for all payment modes:", totalAmountsForAllPaymentModes);
  
//       // Optionally, you can send the result in the response
//       res.status(200).json({ totalAmountsForAllPaymentModes });
//     } catch (error) {
//       console.error("Error:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };

const paymentreport = async (req, res) => {
    try {
      const updatedSlotBookings = await SlotBookingModel.find({ isActive: 'Active', status: true });
  
      // Function to calculate total amount for all payment modes
      const calculateTotalAmountsForAllPaymentModes = (bookingData) => {
        const totalAmounts = {};
  
        // Iterate through each booking data
        bookingData.forEach((booking) => {
          // Check if payment_details is defined and is an array
          if (booking.payment_details && Array.isArray(booking.payment_details)) {
            // Iterate through payment_details array
            booking.payment_details.forEach((payment) => {
              const paymentMode = payment.payment_mode.payment_mode;
  
              // Add the total_amount for the payment mode to the totalAmounts object
              totalAmounts[paymentMode] = (totalAmounts[paymentMode] || 0) + payment.received_amount;
            });
  
            // Include advance payment mode if advance_received is 'yes'
            if (booking.advance_received === 'yes') {
              const advancePaymentMode = booking.advance_mode.adv_payment_mode;
              totalAmounts[advancePaymentMode] = (totalAmounts[advancePaymentMode] || 0) + booking.advance_amount_received;
            }
          }
        });
  
        return totalAmounts;
      };
  
      // Calculate total amounts for all payment modes
      const totalAmountsForAllPaymentModes = calculateTotalAmountsForAllPaymentModes(updatedSlotBookings);
  
      // Display the total amounts for all payment modes
      console.log("Total amounts for all payment modes:", totalAmountsForAllPaymentModes);
  
      // Optionally, you can send the result in the response
      res.status(200).json({ totalAmountsForAllPaymentModes });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


module.exports = {
    getSlotBySearch,
    getAllSlotBookings,
    getActiveSlotBookings,
    getInactiveSlotBookings,
    getFalseStatusSlotBookings,
    getActiveSlotBookingById,
    getSlotBookingById,
    createSlotBooking,
    updateSlotpayById,
    deleteSlotBookingById,
    checkOverlappingSlots,
    getSlotBookingsByBookingDate,
    getSlotBookingsBySlotDate,
    getSlotWithPendingBalance,
    getSlotBookingsByBookingRange,
    getSlotBookingsBySlotRange,
    getPaymentsByUpdatedDateRange,
    getPaymentsByUpdatedDatewise,
    getPaymentsByPaidDatewise,
    getPaymentsByPaidDateRange,
    getwithoutpaymentById,
    getallwithoutpayment,
    updateSlotById,
    getallpayment,
    paymentreport
};

















// const extractAndModifyPaymentDetails = (paymentDetails) => {
//     if (!paymentDetails || paymentDetails.length === 0) {
//         return []; // Return an empty array if paymentDetails is falsy or empty
//     }

//     // Extract values from the first payment_details object
//     const {
//         total_amount: totalAmount1 = 0,
//         advance_received: advanceReceived1 = false, // Modify this based on your data
//         advance_amount_received: advanceAmountReceived1 = 0, // Modify this based on your data
//         payment_received_by: paymentReceivedBy1 = null,
//         payment_mode: paymentMode1 = null,
//     } = paymentDetails[0];

//     // Calculate balance_amount as the difference between total_amount and advance_amount_received
//     const balanceAmount1 = totalAmount1 - advanceAmountReceived1;

//     // Set balance_amount in the payment_details array
//     const modifiedPaymentDetails1 = {
//         total_amount: totalAmount1,
//         advance_received: advanceReceived1,
//         advance_amount_received: advanceAmountReceived1,
//         payment_received_by: paymentReceivedBy1,
//         payment_mode: paymentMode1,
//         balance_amount: balanceAmount1
//     };

//     // Extract values from the second payment_details object, defaulting to an empty object if not present
//     const paymentDetails2 = paymentDetails[1] || {};
//     const {
//         total_amount: totalAmount2 = 0,
//         advance_received: advanceReceived2 = advanceReceived1, // Modify this based on your data
//         advance_amount_received: advanceAmountReceived2 = advanceAmountReceived1, // Modify this based on your data
//         final_amount_received:final_amount_received2 = 0,
//         balance_received_by: paymentReceivedBy2 = null,
//         balance_payment_mode: paymentMode2 = null,
//     } = paymentDetails2;

//     // Calculate balance_amount as the difference between total_amount and advance_amount_received
//     const balanceAmount2 = totalAmount2 - advanceAmountReceived2 - final_amount_received2;
    
//     // Set balance_amount in the payment_details array
//     const modifiedPaymentDetails2 = {
//         total_amount: totalAmount2,
//         advance_received: advanceReceived2,
//         advance_amount_received:advanceAmountReceived1,
//         final_amount_received: final_amount_received2,
//         pending_balance: balanceAmount2,
//         balance_received_by: paymentReceivedBy2,
//         balance_payment_mode: paymentMode2,
//         balance_amount: balanceAmount2
//     };

//     // Return an array with the modified first and second payment details objects
//     return [modifiedPaymentDetails1, modifiedPaymentDetails2];
// };





// const updateSlotBookingById = async (req, res) => {
//     const bookingId = req.params.id;
//     const updateData = req.body;

//     try {
//         const existingBooking = await SlotBookingModel.findById(bookingId)

//         if (!existingBooking) {
//             return res.status(404).json({ error: "Booking not found" });
//         }

//         existingBooking.isActive = 'Inactive';
//         existingBooking.status = true;
//         existingBooking.updated_at = new Date();
//         await existingBooking.save();

//         // Generate a new unique booking_id for the new booking
//         const newBookingId = await generateUniqueBookingId();

//         // Calculate hours using the provided function
//         const hours = calculateHours(updateData.from_time || existingBooking.from_time, updateData.to_time || existingBooking.to_time);

//         const existingPaymentDetails = existingBooking.payment_details;
//         // Check if payment_details is defined and has elements
//         const updatedPaymentDetails = updateData.payment_details && updateData.payment_details.length
//             ? updateData.payment_details
//             : existingBooking.payment_details;

//         // Extract and modify payment details
//         const modifiedPaymentDetails = extractAndUpdatePaymentDetails(existingPaymentDetails, updatedPaymentDetails);

//         // Create a new slot booking with the updated data and a new booking_id
//         const newSlotBooking = new SlotBookingModel({
//             booking_id: newBookingId,
//             b_date: updateData.b_date || existingBooking.b_date,
//             c_id: updateData.c_id || existingBooking.c_id,
//             from_time: updateData.from_time || existingBooking.from_time,
//             to_time: updateData.to_time || existingBooking.to_time,
//             hours,
//             payment_details: modifiedPaymentDetails,
//             slot_created_by: updateData.slot_created_by || existingBooking.slot_created_by,
//             slot_updated_by: updateData.slot_updated_by || existingBooking.slot_created_by,
//             updated_at: req.body.updated_at || Date.now(),
//             isActive: 'Active',
//             status: true,
//         });

//         const savedNewSlotBooking = await newSlotBooking.save();

//         res.status(200).json({
//             message: "Booking updated successfully",
//             updatedSlotBooking: savedNewSlotBooking
//         });
//     } catch (error) {
//         console.error("Error updating slot booking by ID", error);
//         res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// };

// const extractAndUpdatePaymentDetails = (existingPaymentDetails, updatedPaymentDetails) => {
//     if (!updatedPaymentDetails || updatedPaymentDetails.length === 0) {
//         return existingPaymentDetails || []; // Return existing payment details if updated details are falsy or empty
//     }

//     // Extract values from the first payment_details object
//     const {
//         total_amount: totalAmount1 = (updatedPaymentDetails[0] && updatedPaymentDetails[0].total_amount) || (existingPaymentDetails[0] && existingPaymentDetails[0].total_amount) || 0,
//         advance_received: advanceReceived1 = (updatedPaymentDetails[0] && updatedPaymentDetails[0].advance_received) || (existingPaymentDetails[0] && existingPaymentDetails[0].advance_received) || false,
//         advance_amount_received: advanceAmountReceived1 = (updatedPaymentDetails[0] && updatedPaymentDetails[0].advance_amount_received) || (existingPaymentDetails[0] && existingPaymentDetails[0].advance_amount_received) || 0,
//         payment_received_by: paymentReceivedBy1 = (updatedPaymentDetails[0] && updatedPaymentDetails[0].payment_received_by) || (existingPaymentDetails[0] && existingPaymentDetails[0].payment_received_by) || null,
//         payment_mode: paymentMode1 = (updatedPaymentDetails[0] && updatedPaymentDetails[0].payment_mode) || (existingPaymentDetails[0] && existingPaymentDetails[0].payment_mode) || null,
//     } = updatedPaymentDetails[0] || {};

//     // Calculate balance_amount as the difference between total_amount and advance_amount_received
//     const balanceAmount1 = totalAmount1 - advanceAmountReceived1;

//     // Set balance_amount in the payment_details array
//     const modifiedPaymentDetails1 = {
//         total_amount: totalAmount1,
//         advance_received: advanceReceived1,
//         advance_amount_received: advanceAmountReceived1,
//         payment_received_by: paymentReceivedBy1,
//         payment_mode: paymentMode1,
//         balance_amount: balanceAmount1
//     };

//     // Extract values from the second payment_details object, defaulting to an empty object if not present
//     const paymentDetails2 = updatedPaymentDetails[1] || {};
//     const {
//         total_amount: totalAmount2 = (updatedPaymentDetails[1] && updatedPaymentDetails[1].total_amount) || (existingPaymentDetails[1] && existingPaymentDetails[1].total_amount) || 0,
//         advance_received: advanceReceived2 = (updatedPaymentDetails[1] && updatedPaymentDetails[1].advance_received) || (existingPaymentDetails[1] && existingPaymentDetails[1].advance_received) || advanceReceived1,
//         advance_amount_received: advanceAmountReceived2 = (updatedPaymentDetails[1] && updatedPaymentDetails[1].advance_amount_received) || (existingPaymentDetails[1] && existingPaymentDetails[1].advance_amount_received) || 0,
//         final_amount_received: finalAmountReceived2 = (updatedPaymentDetails[1] && updatedPaymentDetails[1].final_amount_received) || (existingPaymentDetails[1] && existingPaymentDetails[1].final_amount_received) || 0,
//         balance_received_by: paymentReceivedBy2 = (updatedPaymentDetails[1] && updatedPaymentDetails[1].payment_received_by) || (existingPaymentDetails[1] && existingPaymentDetails[1].payment_received_by) || null,
//         balance_payment_mode: paymentMode2 = (updatedPaymentDetails[1] && updatedPaymentDetails[1].payment_mode) || (existingPaymentDetails[1] && existingPaymentDetails[1].payment_mode) || null,
//     } = paymentDetails2;

//     // Calculate balance_amount as the difference between total_amount and advance_amount_received
//     const balanceAmount2 = totalAmount2 - advanceAmountReceived2 - finalAmountReceived2;

//     // Set balance_amount in the payment_details array
//     const modifiedPaymentDetails2 = {
//         total_amount: totalAmount2,
//         advance_received: advanceReceived2,
//         advance_amount_received: advanceAmountReceived2,
//         final_amount_received: finalAmountReceived2,
//         pending_balance: balanceAmount2,
//         balance_received_by: paymentReceivedBy2,
//         balance_payment_mode: paymentMode2,
//         balance_amount: balanceAmount2
//     };

//     // Return an array with the modified first and second payment details objects
//     return [modifiedPaymentDetails1, modifiedPaymentDetails2];
// }; 


// const getPaymentsBysingleDate = async (req, res) => {
//     const { date } = req.query;

//     try {
//         // Validate that date is provided
//         if (!date) {
//             return res.status(400).json({ error: "The date parameter is required" });
//         }

//         // Parse the provided date string into a Date object
//         const parsedDate = new Date(date);

//         // Check if the date is valid
//         if (isNaN(parsedDate.getTime())) {
//             return res.status(400).json({ error: "Invalid date format" });
//         }

//         // Build the query object for the specified date
//         const dateQuery = {
//             "payment_details.payment_date": parsedDate,
//         };

//         // If payUpdatedDate is provided, include it in the query
//         if (payUpdatedDate) {
//             dateQuery["payment_details.pay_updated_date"] = new Date(payUpdatedDate);
//         }

//         // Query the database for slot bookings with payment details on the specified date
//         const paymentDetailsByDate = await SlotBookingModel.find(dateQuery);

//         res.status(200).json(paymentDetailsByDate);
//     } catch (error) {
//         console.error("Error getting payment details by date", error);
//         res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// };



// const updateSlotById = async (req, res) => {
//     try {
//       const { bookingId } = req.params;
//       const updateFields = req.body;
  
//       // Find the existing slot using booking_id
//       const existingSlotBooking = await SlotBookingModel.findOne({ booking_id: bookingId, isActive: 'Inactive', status: true });
  
//       // Create a new object with the existing values if found, or an empty object
//       const existingValues = existingSlotBooking ? existingSlotBooking.toObject() : {};
  
//       // Combine existing values with updated values
//       const updatedSlotBooking = new SlotBookingModel({
//         ...existingValues,
//         ...updateFields,
//       });
  
//       // Save the new document
//       await updatedSlotBooking.save();
  
//       // Return a response indicating a successful update
//       res.status(200).json({
//         message: 'Slot details updated successfully',
//         updatedSlotBooking: updatedSlotBooking.toObject(),
//       });
//     } catch (error) {
//       // Handle errors during the update process
//       console.error('Error updating slot booking', error);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   };



// const getSlotBookingsByRange = async (req, res) => {
//     try {
//         const { startDate, endDate } = req.params;

//         // Find slots within the specified date range
//         const slotBookings = await SlotBookingModel.find({
//             "b_date": { $gte: startDate, $lt: endDate }
//         })
//         // .select("b_date booking_customer_name booking_customer_phone payment_details.total_amount payment_details.advance_amount_received payment_details.payment_received_by payment_details.final_amount_received payment_details.balance_received_by payment_details.pending_balance ")
//         // .populate({
//         //     path: 'c_id',
//         //     model: 'Customercollection',
//         //     select: 'customer_name'
//         // })
//         // .populate([
//         //     { path: 'advance_received_by', model: 'Usercollection', select: 'name'},
//         //         { path: 'advance_mode', model: 'Paymentcollection', select: 'payment_mode'},
//         //     { path: 'slot_created_by', model: 'Admincollection', select: 'name' },
//         //     { path: 'slot_updated_by', model: 'Admincollection', select: 'name' },
//         //     { path: 'slot_deleted_by', model: 'Admincollection', select: 'name' },
//         //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
//         //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
//         //     { path: 'payment_details.payment_received_by', model: 'Usercollection', select: 'name user_type' },
//         //     { path: 'payment_details.payment_mode', model: 'Paymentcollection', select: 'payment_mode' },
//         // ]);
//         res.status(200).json(slotBookings);
//     } catch (error) {
//         console.error("Error fetching slot bookings by range", error);
//         res.status(500).json({ error: "Internal Server Error", details: error.message });
//     }
// }
