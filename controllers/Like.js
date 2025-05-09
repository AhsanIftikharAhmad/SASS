const Like=require("../models/Like");
const Post=require("../models/Post");

exports.like=async(req,res)=>{
    try{
        //1.get post id
        const {postId}=req.body;

        //2. validation
        if(!postId){
            return res.status(204).json({
                success:false,
                message:"Please fill the details carefully",
            })
        }

        //3. Find wether post exist in the model or not
        const findPost=await Post.findById(postId);

        //4. If post doesn't found in the model
        if(!findPost){
            return res.status(204).json({
                success:false,
                message:"No such post exist in the Post model",
            })
        }

        //4. Get loggedIn userId from token to like the post
        const token=req.user;

        //5. validate token
        if(!token){
            return res.status(204).json({
                success:false,
                message:"Invalid token"
            })
        }

        //Check wether the same user has previously liked the post or not
        const userAlreadyLiked=await Like.findOne({like:token.id, post:postId});
        //user found
        if(userAlreadyLiked){
            return res.status(409).json({
                success:false,
                message:"You have already liked the same post",
            })
        }

        //6. create a like document in the Like model
        const like=await Like.create({
            like:token.id,
            post:postId
        })

        //7. check wether like is created or not
        if(!like){
            return res.status(304).json({
                success:false,
                message:"Like didn't created in Like model"
            })
        }

        //8. Update the Post model by like
        const updatePost=await Post.findByIdAndUpdate(
            postId,
            {
                $push:{
                    likes:token.id,
                }
            },
            {new:true}
        );

        //9. check wether the post model is updated or not
        if(!updatePost){
            return res.status(404).json({
                success:false,
                message:"Post is not udpated successfullly",
            })
        }

        //10. return the successfull response
        return res.status(200).json({
            success:true,
            message:"Post has been Liked successfully",
            data:updatePost,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error: Errror occured in liking the post",
        })
    }
}

//disliking the post
exports.dislike=async(req,res)=>{
    try{
        //1.get post id
        const {postId}=req.body;

        //2. validation
        if(!postId){
            return res.status(204).json({
                success:false,
                message:"Please enter the postId carefully",
            })
        }

        //3. find wether the postId exist or not in the post model 
        const existPost=await Post.findById(postId);

        //4. if not found
        if(!existPost){
            return res.status(404).json({
                success:false,
                message:"post doesn't exist in the post model"
            })
        }

        //5. take the user which is disliking the post
        const token=req.user;

        //6. Validate the token
        if(!token){
            return res.status(404).json({
                success:false,
                message:"Invalid token",
            })
        }

        
        //7. extract userId from token
        const user=token.id;

        //8. find the user and postId from like model
        const dislikePost=await Like.findOne({post:postId,like:user});

        //9. validate
        if(!dislikePost){
            return res.status(403).json({
                success:false,
                message:"You can't dislike the post"
            })
        }

        //10. dislike the post by deleting the from the like model
        const deleteLike=await Like.findOneAndDelete({post:postId,like:user});

        //11. check wether the like has been deleted or not
        if(!deleteLike){
            return res.status(500).json({
                success:false,
                message:"Like can't be deleted",
            })
        }

        //12. delete the like from the Post model
        const deleteLikePost=await Post.findByIdAndUpdate(
            postId,
            {
                $pull:{
                    likes:user,
                }
            },
            {new:true},
        ).populate("likes").exec();

        //13. check wether the post has been disliked or not from post model
        if(!deleteLikePost){
            return res.status(500).json({
                success:false,
                message:"Like couldn't be deleted from the post model"
            })
        }

        //14. return the success response
        return res.status(200).json({
            success:true,
            message:"Post has been disliked successfully",
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occured while disliking the post"
        })
    }
}