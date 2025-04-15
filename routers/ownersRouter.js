const express = require('express');
const router = express.Router();
const ownerModel = require('../models/owner-model');
const productModel = require('../models/product-model')

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

router.get('/admin', async (req, res) => {    
    let products = await productModel.find({id:productModel._id})
    res.render('admin',{products});
});

router.get('/deleteproducts/:_id',async (req,res) => {
    const productId = req.params._id;
    await productModel.findByIdAndDelete(productId);
    res.flash("Product deleted successfully");
})



module.exports = router;