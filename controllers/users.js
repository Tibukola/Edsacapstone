const userSchema = require("../models/users")
const moment = require("moment");
const {sendMail} = require("../helpers/index");
const signup = async ( req, res, next)=>{
    try{
       const {username, password, email, dob } =req.body
       if (!username ||!password ) return res.status(400).json({message:"username and password is required"});
       const doc_size = await userSchema.countDocuments();
       const age = new Date().getFullYear()- new Date(dob).getFullYear();
       if (age <18) return res.status(400).json({message:"you need to be at least 18yrs old"});
       const user = new userSchema({
        username,
        password,
        email,
        uid: doc_size +1,
        dob:dob,
       });
       const data = await user.save();
       return res.status(201).json({message:"user created sucessfully", data,  doc_size});
    }catch(error){
        next(error);
    }
};
const get_users = async (req, res, next) =>{
    try {
        const query = req.query;
        const data = await userSchema.find().select("username uid createdAt").sort({ createdAt:-1}).limit(2);
        const new_data = data.map((doc,index)=>{
            return{
                index: index+1,
                username:doc.username,
                uid:doc.uid ?? null,
                id:doc._id,
                joined:moment (doc.createdAt).format("YYYY MMM Do"),
                age:moment().diff(doc.dob, "years"),
            };
        });
        const filtered = new_data.filter((doc)=>doc.uid !==null);
        console.log(filtered);
        return res.status(200).json({message:"users fetched", data: new_data });
    } catch (error) {
        next(error);
    }
};

const login =async  (req, res, next) =>{};
module.exports = {signup, get_users, login};