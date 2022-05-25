const res = require("express/lib/response");
const jwt = require("jsonwebtoken");

//VERIFY TOKEN
const vrfTok = (req, res, next) => {
    const authHeader = req.headers.token
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user)=> {
            if(err) res.status(403).json("Invalid token!!");
            req.user = user;
            next();
        })
    }else{
        return res.status(401).json("Not authenticated!")
    }
}

//VERIFY TOKEN AND AUTHORIZATION
const vrfTokAuth = (req,res,next) => {
    vrfTok(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json("Not allowed!")
        }
    })
}

//VERIFY TOKEN AND ADMIN
const vrfTokAdmin = (req,res,next) => {
    vrfTok(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }else{
            res.status(403).json("Not allowed!")
        }
    })
}



module.exports = {vrfTok, vrfTokAuth, vrfTokAdmin};