const express = require('express');
const router = express.Router();
const isLoggedin = require('../middlewares/isLoggedin')
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');

router.get('/', (req,res) => {
    let error = req.flash("error");
    res.render('index', {error, loggedin: false});
})

router.get('/shop',isLoggedin, async (req,res) => {
    let products = await productModel.find();
    let success = req.flash("success")
    res.render('shop', { products, success});
})


router.get('/cart',isLoggedin, async (req,res) => {
    let user = await userModel.findOne({email: req.user.email}).populate('cart')
    let item = user.cart;
    item.forEach(element => {
        let netAmount = (Number(element.price) - Number(element.discount)) + 20;
        element.netamount = netAmount;
    });
    
    res.render('cart',{user});
})

router.get('/addtocart/:product_id',isLoggedin, async (req,res) => {
    let user = await userModel.findOne({email: req.user.email})
    user.cart.push(req.params.product_id)
    await user.save();
    req.flash("success", "Added to Cart")
    res.redirect("/shop")
})

module.exports = router;