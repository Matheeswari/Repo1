const sample =require('express');

const AppServer =sample();
AppServer.use('/api',require('./Route/Route'))

module.exports=AppServer;