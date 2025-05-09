const Post = require("../models/Post");
const SavePost = require("../models/SavePost");
const User=require("../models/User");

exports.savePost=async(req,res)=>{
    try{
        //1. fetch the postId
        const {postId}=req.body;

        //2. validation
        if(!postId){
            return res.status(400).json({
                success:false,
                message:"Please enter the postId carefully",
            })
        }

        //3. Find wether the post exist or not
        const findPost=await Post.findById(postId);

        if(!findPost){
            return res.status(404).json({
                success:false,
                message:"No such postId exist in the model",
            })
        }

        //4. Extract the token for saving the post
        const token=req.user;

        if(!token){
            return res.status(204).json({
                success:false,
                message:"Please Login First"
            })
        }

        //5. check the user has already saved the post or not.
        const postAlreadySaved=await SavePost.findOne({
            user:token.id,
            post:postId
        })

        //if already saved-> unsaved
        if(postAlreadySaved){
            //delete from save model
            const unsavedPost=await SavePost.findOneAndDelete(
                {post:postId,user:token.id}
            )
            if(!unsavedPost){
                return res.status("Error occured in unsaving");
            }
            //update the user db
            const removeSavePost=await User.findByIdAndUpdate(
                token.id,
                {
                    $pull:{
                        savedPosts:postAlreadySaved._id
                    }
                },
                {new:true}
            ).populate("savedPosts").exec();

            if(!removeSavePost)
            return res.status(500).json({
                success:false,
                message:"Error occured while User model"
            })

            return res.status(200).json({
                success:true,
                message:"Post Unsaved",
                data:unsavedPost
            })
        }else{
            //save the new post
            const saveNewPost=await SavePost.create({
                post:postId,
                user:token.id,
            })

            if(!saveNewPost){
                return res.status(304).json({
                    success:false,
                    message:"Post not saved"
                })
            }

            const updateUser=await User.findByIdAndUpdate(
                token.id,
                {
                    $push:{
                        savedPosts:saveNewPost._id
                    }
                },
                {new:true}
            ).populate("savedPosts").exec();

            if(!updateUser){
                return res.status(304).json({
                    success:false,
                    message:"User db not updated in saving the post"
                })
            }

            return res.status(200).json({
                success:true,
                message:"Post Saved",
                data:updateUser
            })
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occured in saving the post",
            data:error
        })
    }
}