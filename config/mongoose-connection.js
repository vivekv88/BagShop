const mongoose = require('mongoose');
const debugr = require('debug')('development:mongoose');
const config = require('config');

mongoose
.connect(`${config.get("MONGODB_URI")}/bagshop `) 
.then(() => {
    debugr('Connected to database');
}).catch((err) => {     
    debugr(err);
});

module.exports = mongoose.connection;