const jwt = require("jsonwebtoken");
const {userModel} = require("../models/users");
const authToken = async(req, res, next) => {
    try {
        const token = req.header("Authorization");
        if(!token) return res.status(401).json({message:"token not provided"});
       const data = await jwt.verify(token, "1234");
       const user = await userModel.findById(data.id);
       if (!user) return res. status(404).json({message:"user not found"});
       console.log(user);
       req.user = user;
        next();
    } catch (error) {
      return res.status(400).json({message:"unauthorized"});  
    }
};
module.exports ={authToken};