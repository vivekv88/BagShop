const mongoose = require('mongoose');
const debugr = require('debug')('development:mongoose');
const config = require('config');

mongoose.connect('mongodb+srv://vivekraj2955:vivek8874@cluster1.dpqkjhb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1') 
.then(() => {
    debugr('Connected to database');
}).catch((err) => {     
    debugr(err);
});

module.exports = mongoose.connection;