const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const { contentType } = require("express/lib/response");
const jwt = require("jsonwebtoken");

//REGISTRATION
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString(),
        isAdmin: req.body.isAdmin,
    });

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }catch(err){
        res.status(500).json(err);
    }

});

//LOGIN
router.post("/login", async (req,res) => {
    try{
        const user = await User.findOne({username: req.body.username });
        if(!user) return res.status(401).json("Incorrect username!");
        const hashedPass = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SECRET); 
        const ogpass = hashedPass.toString(CryptoJS.enc.Utf8);
        if(ogpass !== req.body.password) return res.status(401).json("Incorrect password!");
        const accToken = jwt.sign({
            id:user._id, isAdmin: user.isAdmin,
        },process.env.JWT_SECRET, {expiresIn:"2d"});
        const {password, ...others} = user._doc;
        res.status(200).json({...others, accToken});
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router

