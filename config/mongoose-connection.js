const mongoose = require('mongoose');
const debugr = require('debug')('development:mongoose');
const config = require('config');

mongoose.connect('mongodb+srv://vivekraj2955:vivek8874@cluster1.dpqkjhb.mongodb.net/?') 
.then(() => {
    debugr('Connected to database');
}).catch((err) => {     
    debugr(err);
});

module.exports = mongoose.connection;