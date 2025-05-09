const Tag=require("../models/Tag");
const Post=require("../models/Post");

exports.createTag=async(req,res)=>{
    try{
        //1.get tag and post id
        const {title,postId}=req.body;

        //2. validate
        if(!title || !postId){
            return res.status(204).json({
                success:false,
                message:"Please fill out all the details."
            })
        }

        //3. get userId from token
        const token=req.user;
        if(!token){
            return res.status(404).json({
                success:false,
                message:"Token not Found"
            })
        }

        //4. Check wether such post exist or not
        const post=await Post.findById(postId);
        if(!post){
            return res.status(404).json({
                success:false,
                message:"No such Post found in Post Model",
            })
        }

        //5. Only owner can create tag
        if(post.createdBy.toString()!==token.id){
            return res.status(401).json({
                success:false,
                message:"You can't create a tag"
            })
        }

        //6. now create tag and add in the Tag model
        const createTag=await Tag.create({
            title:`#${title}`,
            post:postId,
            user:token.id,
        })

        //7. Check wether the tag has been created or not
        if(!createTag){
            return res.status(501).json({
                success:false,
                message:"Tag hasn't been created"
            })
        }

        //8. update the post tag for tag
        const updatedPost=await Post.findByIdAndUpdate(
            {_id:postId},
            {
                $push:{
                    tags:createTag._id,
                }
            },
            {new:true}
        )

        //9. check whether the Post model has been updated or not
        if(!updatedPost){
            return res.status(501).json({
                success:false,
                message:"Post Model has noot been updated",
            })
        }

        //10. return success response
        return res.status(200).json({
            success:true,
            message:"Tag has been created successfully",
            data:updatedPost,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occured while creating the Tag"
        })
    }
}