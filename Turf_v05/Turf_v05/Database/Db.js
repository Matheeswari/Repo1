const mongoose=require('mongoose');
require('dotenv').config();
mongoose
.connect(process.env.MONGO_URI_TURF_DEMO )
.then(()=>console.log("MongoDB connected"))
.catch((err)=>console.log(err));

module.exports = mongoose; 