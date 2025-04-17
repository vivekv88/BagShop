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


router.get('/cart', isLoggedin, async (req, res) => {
    try {
        if (!req.user || !req.user.email) {
            return res.redirect('/login'); // or some error response
        }

        let user = await userModel.findOne({ email: req.user.email }).populate('cart.product');
        

        user.cart.forEach(element => {
            if (element.product) {
                let netAmount = (Number(element.product.price) - Number(element.product.discount)) + 20;
                // Add netamount temporarily for rendering
                element.product.netamount = netAmount;
            }
        });

        res.render('cart', { user });

    } catch (err) {
        console.error('Error loading cart:', err);
        res.status(500).send("Something went wrong");
    }
});


router.get('/addtocart/:product_id',isLoggedin, async (req,res) => {
    let user = await userModel.findOne({email: req.user.email})

    //check for existing item
    let existingItem = await user.cart.find(item => item.product.toString() === req.params.product_id)
    if(existingItem){
        existingItem.quantity += 1;
    }else{
        // If product doesn't exist, add it with quantity 1
        user.cart.push({
            product: req.params.product_id,
            quantity: 1
        });
    }

    await user.save();
    req.flash("success", "Added to Cart")
    res.redirect("/shop")
})



router.get('/increasequantity/:product_id', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    const cartItem = user.cart.find(item => item.product.toString() === req.params.product_id);
    
    if (cartItem) {
        cartItem.quantity += 1;
        await user.save();
    }
    
    res.redirect('/cart');
});

router.get('/removefromcart/:_id', async (req, res) => {
    const productId = req.params._id;

    // Assuming you're using Passport.js and user is authenticated
    const user = await userModel.findOne({ id: req.body._id });

    if (!user) {
        return res.status(404).send("User not found");
    }

    const cartItem = user.cart.find(item => item.product.toString() === productId);

    if (cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            user.cart = user.cart.filter(item => item.product.toString() !== productId);
        }

        await user.save();
    }

    res.redirect('/cart');
});

router.get('/decreasequantity/:product_id', isLoggedin, async (req, res) => {
    let user = await userModel.findOne({email: req.user.email});
    const cartItem = user.cart.find(item => item.product.toString() === req.params.product_id);
    
    if (cartItem) {
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
            // Remove item if quantity becomes 0
            user.cart = user.cart.filter(item => item.product.toString() !== req.params.product_id);
        }
        await user.save();
    }
    res.redirect('/cart');
});

module.exports = router;