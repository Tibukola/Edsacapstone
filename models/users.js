// const { string } = require("joi");
const mongoose = require("mongoose");

const businessDataSchema = new mongoose.Schema({
    user:{
        type:String,
        ref:"users",
        required:true,
    },
    business_name: String,
    address: String,
    city: String,
    state:String,
    country:String,
    cac:String,
    website: String,
});

const individualDataSchema = new mongoose.Schema({
    address:String,
    serviceRequired: String,
    budget: Number,
    availability: Date,
    user:{
        type:String,
        ref:"users",
        required:true,
    },
})

const userSchema = new mongoose.Schema(
    {
    name:{
        type: String,
        required:true,
        toLowerCase:true,
    },
    password:{
        type: String,
        required:true
    },
    // uid:{
    //     type:Number,
    //     required:true,
    // },
    email:{
        type: String,
        required:true,
        lowerCase: true,
    },
    Account_type: String,
   
},{
    timestamps:true,
}
);

const userModel = mongoose.model("users", userSchema);
const businessDataModel = mongoose.model("business", businessDataSchema);
const individualDataModel = mongoose.model("individual", individualDataSchema);

module.exports ={
    userModel,
    businessDataModel,
    individualDataModel
};