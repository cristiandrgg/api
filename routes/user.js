const User = require("../models/User");
const { vrfTok, vrfTokAuth, vrfTokAdmin } = require("./vrfTok");

const router = require("express").Router();

//GET USER
router.get("/find/:id", vrfTokAdmin, async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    }catch(err){
        res.status(500).json(err)
    }

})

//GET ALL USERS
router.get("/", vrfTokAdmin, async(req, res)=>{
    const query = req.query.only_new
    try{
        const users = query ? await User.find().sort({_id:-1}).limit(3) : await User.find()
        res.status(200).json(users);
    }catch(err){
        res.status(500).json(err)
    }

})

//GET STATS FROM USERS
router.get("/stats", vrfTokAdmin, async (req, res) => {
    const currentDate = new Date();
    const lastYrDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
    try {
        const data = await User.aggregate([
          { $match: { createdAt: { $gte: lastYrDate } } },
          {
            $project: {
              month: { $month: "$createdAt" },
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: 1 },
            },
          },
        ]);
        res.status(200).json(data)
      } catch (err) {
        res.status(500).json(err);
      }
    });


//UPDATE USER
router.put("/:id", vrfTok, async (req,res) =>{
    if(req.body.password){
       req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SECRET).toString()
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        },
        {new:true})
        res.status(200).json(updatedUser)
    }catch(err){res.status(500).json(err)}
});


//DELETE USER
router.delete("/:id", vrfTokAuth, async(req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User deleted!")
    }catch(err){
        res.status(500).json(err)
    }

})

module.exports = router

