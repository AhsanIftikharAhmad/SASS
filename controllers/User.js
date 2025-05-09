const User=require("../models/User");

exports.getCurrentUser=async(req,res)=>{
    try{
        //1. fetch the token
        const token=req.user;

        //2. validation
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Token not found  ",
            })
        }
        //3. find the token in User DB
        const findUser=await User.findById(token.id).populate({
            path:"savedPosts",
            populate:{
                path:"post"
            }
        }).populate("additionDetails").populate("posts").exec();

        if(!findUser){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"User details fetched successfully",
            data:findUser
        })
    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Errro occured while fetching the user details.",
        })
    }
}

