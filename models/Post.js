const mongoose=require("mongoose");

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    postImage:{
        type:String,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Like",
        },
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment",
        }
    ],
    tags:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Tag",
        }
    ]

},{timestamps:true})

module.exports=mongoose.model("Post",postSchema);