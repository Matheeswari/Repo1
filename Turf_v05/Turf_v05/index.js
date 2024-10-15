const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const HTTP_SERVER = express();
const config = require("./Database/Db")
const PORT = process.env.PORT || 3000;

HTTP_SERVER.use(express.json())
HTTP_SERVER.use(bodyParser.json())
HTTP_SERVER.use(express.urlencoded({extended:false}))
HTTP_SERVER.use(cors())


HTTP_SERVER.get('/', (req, res) => {
    console.log('Server is running.');
    res.send('Server is running.');   // res.send use - display that contains.
});

HTTP_SERVER.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

HTTP_SERVER.use('/',require('./app'));