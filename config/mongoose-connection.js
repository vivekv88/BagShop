const mongoose = require('mongoose');

mongoose
.connect('mongodb://localhost:27017/bagshop')
.then(() => {
    console.log('Connected to database');
}).catch((err) => {     
    console.log('Database connection failed');
    console.log(err);
});

module.exports = mongoose.connection;