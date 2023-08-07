const {db, Timestamp, FieldValue} = require("../config/index");
// const cloudinary = require('cloudinary').v2;
const path = require("path");
// cloudinary.config({ 
//     cloud_name: 'dr4hmtpan', 
//     api_key: '713233153291129', 
//     api_secret: 'SB8QKAevN9AwOnW5mzPP128n_CE' 
//   });
  const { userModel, businessDataModel, individualDataModel} = require("../models/users")
  const jwt = require("jsonwebtoken");
  const bcrypt = require("bcrypt");

  const signup_get = async (req, res, next) =>{
    return res.render("signup", { error: ""}); 
    };
    
    const signup_user = async (req, res, next) => {
        const {email, name,  Account_type, password, confirm_password} =req.body;
        try {
            if(password !== confirm_password) return res.render("signup", {error:"passwords does not match"})
        const user = await userSchema.findOne({email});
    // if(user) return res.render("signup", {error:"email already exists"});
    
    const hashed =  bcrypt.hashSync(password, 10);
    console.log(hashed);
    
    const newUser = new userSchema({
        email,
        password:hashed,
        name,
    });
        const data = await newUser.save();
        console.log(data); 
        return res.redirect("/auth/login");
        } catch (error) {
         return res.render("signup", {error: error.message});   
        }
    }; 
    const login_get = async (req, res) =>{
        try {
            return res.render("login", {error: ""});
        } catch (error) {
        console.log(error);
        return res.render("login", {error: error.message}) ;   
        }
    };
    const login_post = async (req, res, next) =>{
        const { email, password} = req.body;
        try {
            if (!email || !password) return res.render("login", {error: `email or password required`});
            var user = await userSchema.findOne({ email });
            if(!user) return res.render("login", {error: `email or password incorrect1` });
            const comparePwd = await bcrypt.compare(password, user.password);
            console.log(comparePwd);
            if (!comparePwd) return res.render("login", {error: `email or password incorrect2`});
            user.password = undefined;
            // await user.save();
            req.user= user;
            // req.session.userId = user._id
            return res.render("profile", {user});
        } catch (error) {
        console.log(error);
        return res.render("login", {error: error.message}) ;   
        }
    };
    

const signup = async (req, res, next)=> {
    try {
const {name, email, password, Account_type}  = req.body;
const user = await userModel.create({name, email, password: await  bcrypt.hash(password, 10), Account_type});
const token = await jwt.sign({id: user._id},"1234");
const data = Object.freeze({
    ...user._doc,
    token,
});
 res.status(201).json({data});
const doc = await db.collection ("users").add({ name, email,password, Account_type, createdAt:Timestamp.fromDate(new Date()),
});
const userRef = db.collection("users").doc(doc.id);
const doc2 = await userRef.get();
if (!doc2.exists) {
    return res.status(201).json({message:"no data"})
} else {
    return res.status(201).json({message:"data stored", data: doc2.data()});
}
 } catch (error) {
        next(error);
 }
    };

const complete_profile_business = async ( req, res, next)  => {
    try {
        const {_id, Account_type} = req.user;
        const {address, state, country, cac, website, business_name } = req.body;
         if(Account_type !== "business") return res.status(401).json({message: "account is not a business type"});
        const existing = await businessDataModel.findOne({user:_id});
       if (!existing){
        const data = await businessDataModel.create({address, state, country, cac, website, user: _id, business_name });
        console.log(Account_type);
        return res.status(201).json({data});
    }
       const data = await businessDataModel.findByIdAndUpdate(existing._id, {address, state, country, cac, website, business_name }, {new:true});
       return res.status(201).json({data});
    } catch (error) {
        next(error);
    }
};

const complete_profile_individual = async( req, res, next)  => {
    try {
        const {_id, Account_type} = req.user;
        const {address, serviceRequired ,budget, availabilty } = req.body;
         if(Account_type !== "individual") return res.status(401).json({message: "account is not an individual type"});
        const existing = await individualDataModel.findOne({user:_id});
       if (!existing){
        const data = await individualDataModel.create({address, serviceRequired , user: _id, budget, availabilty});
        console.log(Account_type);
        return res.status(201).json({data});
    }
       const data = await individualDataModel.findByIdAndUpdate(existing._id, {address, serviceRequired ,budget, availabilty,}, {new:true});
       return res.status(201).json({data});
    } catch (error) {
        next(error);
    }
};

    const upload_file = async(req, res, next) =>{
        try{
            if (!req.file.path) return res.status(400).json({message:"file upload failed try again"});
            console.log(req.file.path);
            const hostname = req.get("host");
            const filepath = req.file.path.replace(new RegExp("\\b" + "public" + "\\b", "gi"), "").trim();
            const data = `$(hostname)$(filepath)`;
            const result =  await cloudinary.uploader.upload(req.file.path);
            console.log(result);
            return res.status(200).json({message:"fileuploaded successfully", result});
        } catch(error){
            console.log(error);
        }
    };

    const login = async (req, res, next)=>{
        try {
           const {email , password} = req.body;
           const user = await userModel.findOne({email});
           if(!user) return res.status(400).json({message:"user not found"});
           user._password = undefined;
           user._v = undefined;
           if (user.Account_type !== "business" && user.Account_type !=="individual")  return res.status(401).json({message:"Account type not valid"});
           if (user.Account_type == "business") {
            const profile = await businessDataModel.findOne({user:user._id}).select("-user-_v");
            const data = Object.freeze({
                ...user._doc,
                // ...profile._doc,
                // ...user,
                // ...profile,
            });
            return res.status(200).json({message:"user found", user });

           }
           if (user.Account_type == "individual") {
            const profile = await individualDataModel.findOne({user:user._id}).select("-user-_v");
            const data = Object.freeze({
                // ...user._doc,
                // ...profile._doc,
                ...user,
                ...profile,
            });
            return res.status(200).json({message:"user found", user, });

           }

           const profile = await individualDataModel.findOne({user:user._id}).select("-user-_v");
           const data = Object.freeze({
             ...user._doc,
               ...profile._doc,
           
           });
           return res.status(200).json({message:"user found", data, user});
        
        } catch (error) {
           next(error) ;
        }
    };
    
module.exports = {
    signup_user,
    signup_get,
    login_get,
    login_post,
    signup,
    complete_profile_business,
    complete_profile_individual,
    upload_file,
    login
    
};