const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { generateToken } = require('../utils/generateToken')
const productModel = require('../models/product-model')

module.exports.registerUser = async function (req, res) { 
    
    try {
        let {fullname,email,password} = req.body;

        let user = await userModel.findOne({email: email})
        if(user) return res.status(401).send("User already exists, please login")

        bcrypt.genSalt(10,function(err, salt){
            bcrypt.hash(password,salt,async function(err,hash){
                if(err) return res.send(err.message);
                else{
                    let user = await userModel.create({
                        email,
                        fullname,
                        password : hash
                    })
                    let token = generateToken(user);
                    res.cookie("token",token);
                    res.send("User Created Successfully");
                } 
               
            })
        })

    
    } 
    catch (error) {
            res.send(error.message);
    }
    
};

module.exports.loginUser = async function(req,res) {
    let {email,password} = req.body;

    let user = await userModel.findOne({email: email})
    if(!user) 
    {
        return res.send("Incorrect email or password")
    }

    else{
        bcrypt.compare(password,user.password,async function(err,result){
            if(result){
                let token = generateToken(user);
                res.cookie("token",token);
                let products = await productModel.find();
                let success = req.flash("success")
                res.render('shop', { products, success});
            }
            else{
                res.send("Something went wrong");
            }
        })
    }
};

module.exports.logoutUser = async function(req,res) {
    res.cookie("token","");
    res.redirect("/");
}

