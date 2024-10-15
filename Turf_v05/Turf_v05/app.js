const express = require('express');
const APP_SERVER = express.Router();

// Use separate route files
APP_SERVER.use('/api',require("./Routes/Adminroute"));
APP_SERVER.use('/api', require("./Routes/Customerroute"));
APP_SERVER.use('/api', require("./Routes/Expenseroute"));
APP_SERVER.use('/api', require("./Routes/Paymentmoderoute"));
APP_SERVER.use('/api', require("./Routes/Slotbookingroute"));
APP_SERVER.use('/api', require("./Routes/Userroute"));
APP_SERVER.use('/api', require("./Routes/Categoryroute"));

module.exports = APP_SERVER;
