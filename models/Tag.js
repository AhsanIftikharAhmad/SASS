const mongoose=require("mongoose");

const tagSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

module.exports=mongoose.model("Tag",tagSchema);