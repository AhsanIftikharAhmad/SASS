const mongoose=require("mongoose");

const profileSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    gender:{
        type:String,
    },
    dateOfBirth:{
        type:String,
    },
    about:{
        type:String,
        trim:true
    },
},{timestamps:true})

module.exports=mongoose.model("Profile",profileSchema);