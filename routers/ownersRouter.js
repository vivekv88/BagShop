const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');

if(process.env.NODE_ENV === 'development'){
    router.post('/create', async (req, res) => {    
        let owners = await ownerModel.find();
        if(owners.length > 0){
           return res.status(401).send('Owner already exists');
        }

        let {fullname, email, password} = req.body;
        let createdowner = await ownerModel.create({
            fullname,
            email,
            password
        });

        res.status(201).send(createdowner);
});
}

router.get('/createproducts', (req, res) => {    
    let success = req.flash("success")
    res.render('createProducts', { success });
});

router.get('/admin', (req, res) => {    
    res.render('admin');
});



module.exports = router;