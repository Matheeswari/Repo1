const express = require('express');
const HTTP_SERVER = express();
const cors = require('cors');
require('./Database/dbConfig');
const PORT = process.env.PORT || 3000;
const path = require('path');

HTTP_SERVER.use(express.json());
HTTP_SERVER.use(express.urlencoded({extended : false}));
HTTP_SERVER.use(cors());

const imagePath = path.join(process.cwd(), 'Controllers', 'Data', 'Image');
HTTP_SERVER.use('/api/Data/Image',express.static(imagePath));



HTTP_SERVER.listen(PORT, ()=>{
    console.log(`Listening at PORT ${PORT}`);
})

HTTP_SERVER.use('/', require('./app'));



