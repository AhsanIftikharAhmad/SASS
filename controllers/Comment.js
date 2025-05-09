const Comment=require("../models/Comment");
const Post=require("../models/Post");

exports.createComment=async(req,res)=>{
    try{
        //1. fetch comment and postId 
        const {comment,postId}=req.body;

        //2. validate
        if(!comment || !postId){
            return res.status(206).json({
                success:false,
                message:"Please fill all deatils carefully",
            })
        }

        //check wether the postId exist or not in post model
        const existPost=await Post.findById(postId);

        if(!existPost){
            return res.status(404).json({
                success:false,
                message:"Post not found in the Post DB"
            })
        }

        //3. extract token from 
        const token=req.user;
        //validate the token
        if(!token){
            return res.status(402).json({
                success:false,
                message:"Invalid token",
            })
        }

        //4. now create comment in Comment model
        const createComment=await Comment.create({
            comment:comment,
            user:token.id,
            post:postId,
        })

        //5. check wether the comment is created or not
        if(!createComment){
            return res.status(501).json({
                success:false,
                message:"Comment model not implemented",
            })
        }

        //6. update the post model
        const updatePost=await Post.findByIdAndUpdate(
            postId,
            {
                $push:{
                    comments:createComment._id,
                }
            },
            {new:true}
        )

        //7. check wether post model has been updated or not
        if(!updatePost){
            return res.status(501).json({
                success:false,
                message:"Post model has not been updated",
            })
        }

        //8. return the json response
        return res.status(201).json({
            success:true,
            message:"Comment has been created successfullly",
            data:updatePost
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occured while creating the comment"
        })
    }
}

//deleting the comment
exports.deleteComment=async(req,res)=>{
    try{
        //1. fetch comment and postId 
        const {postId,commentId}=req.body;

        //2. validate
        if(!postId || !commentId){
            return res.status(206).json({
                success:false,
                message:"Please fill all deatils carefully",
            })
        }

        //check wether the postId exist or not in post model
        const existPost=await Post.findById(postId);

        if(!existPost){
            return res.status(404).json({
                success:false,
                message:"Post not found in the Post DB"
            })
        }

        //3. extract token from 
        const token=req.user;
        //validate the token
        if(!token){
            return res.status(402).json({
                success:false,
                message:"Invalid token",
            })
        }

        //4. now check that comoment exist in that model or not in Comment model
        const existComment=await Comment.findById(commentId);
        // Check wether that comment exist or not
        if(!existComment){
            return res.status(404).json({
                success:false,
                message:"Comment doesn't exist in the Comment model"
            })
        }
        
        //5. check wether the owner of comment is deleting or not
        if(existComment.user.toString()!==token.id){
            return res.status(403).json({
                success:false,
                message:"You can't delete the comment"
            })
        }

        //6. now delete the comment from comment model
        const deleteComment=await Comment.findOneAndDelete({post:postId,_id:commentId});

        //check wetehr the comment is deleted or not
        if(!deleteComment){
            return res.status(501).json({
                success:false,
                message:"Such comment doesn't exist on such post"
            })
        }

        //6. update the post model
        const updatePost=await Post.findByIdAndUpdate(
            postId,
            {
                $pull:{
                    comments:deleteComment._id,
                }
            },
            {new:true}
        )

        //7. check wether post model has been updated or not
        if(!updatePost){
            return res.status(501).json({
                success:false,
                message:"Post model has not been updated",
            })
        }

        //8. return the json response
        return res.status(201).json({
            success:true,
            message:"Comment has been deleted successfullly",
            data:deleteComment,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occured while deleting the comment"
        })
    }
}

//view comment
exports.viewComment=async(req,res)=>{
    try{
        //1. get postId 
        const {postId}=req.body;

        //2. validate
        if(!postId){
            return res.status(400).json({
                success:false,
                message:"Please enter the postId carefully"
            })
        }

        //3. find comments by the help of postId from Comment model
        const comments=await Comment.find({post:postId}).populate("user").exec();

        if(!comments){
            return res.status(400).json({
                success:false,
                message:"No Such postId exist in the comment model",
            })
        }

        //4. return the success response
        return res.status(200).json({
            message:true,
            message:"Comments fetched successfully",
            data:comments
        })

    }catch(error){
        console.log("Error occured while getting the comments");
        return res.status(500).json({
            success:false,
            message:"Error occured in fetching the comments",
            data:error
        })
    }
}

//edit comment
exports.editComment=async(req,res)=>{
    try{
        //1. fetch the newComment data
        const {comment,postId,commentId}=req.body;

        //2. validate
        if(!comment || !postId || !commentId){
            return res.status(206).json({
                success:false,
                message:"Please fill all deatils carefully",
            })
        }

        //3. extract token from 
        const token=req.user;
        //validate the token
        if(!token){
            return res.status(402).json({
                success:false,
                message:"Invalid token",
            })
        }

        //4. Check the existence of commentId and postId in Comment model
        const commentExist=await Comment.findOne({_id:commentId, post:postId});

        if(!commentExist){
            return res.status(404).json({
                success:false,
                message:"No Such Comment-post pair exist."
            })
        }

        //5. Check if the user is the owner of the comment
        if (commentExist.user.toString()!== token.id) {
            return res.status(403).json({
                success: false,
                message: "You can't edit someone else's comment",
            });
        }

        //5. if exist then update the Comment model
        const updatedComment=await Comment.findOneAndUpdate(
            {_id:commentId,post:postId},
            {
                comment:comment,
            },
            {new:true}
        )

        //6. Check wether the edited comment has been updated in Comment model or not
        if(!updatedComment){
            return res.status(501).json({
                success:false,
                message:"Comment Model has been updated "
            })
        }

        //7. return the success response
        return res.status(201).json({
            success:true,
            message:"Comment has been edited successfullly",
            data:updatedComment
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occured while editing the comment"
        })
    }
}