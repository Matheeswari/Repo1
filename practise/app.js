const sample = require('express');

const App_Server = sample()
App_Server.use('/api', require('./Routes/sampleroute'))

module.exports = App_Server;
