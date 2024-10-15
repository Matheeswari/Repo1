const express =require('express');
const HttpServer =express();
const cors =require('cors');
require('./Database/DbConfig');

const port=process.env.port || 3000;
const path=require('path');

HttpServer.use(express.json());
HttpServer.use(express.urlencoded({extended:false}));
HttpServer.use(cors());

const imagePath =path.join(process.cwd(),'Controller','Data','Image');
HttpServer.use('/api/Data/Image',express.static(imagePath));

HttpServer.listen(port,()=>{
    console.log(`Listening at port ${port}`)
})

HttpServer.use('/',require('./app'));