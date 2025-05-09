const Post=require("../models/Post");
const User = require("../models/User");
const cloudinary=require("cloudinary");
require("dotenv").config();

function isFileSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}

//function to upload image to cloudinary
async function uploadToCloudinary(file,folder,quality){
    const options={folder};
    options.resource_type="auto";

    //if there is some value of quality
    if(quality){
        
        options.quality=quality;
    }

    return await cloudinary.uploader.upload(file.tempFilePath,options);
}

exports.createPost=async(req,res)=>{
    try{
        //1. fetch data
        const {title}=req.body;
     
        //fetch file
        const file=req.files.image;
           
        //fetch data from user.body 
        const token=req.user;

        //2. validate the data
        if(!title|| !file){
            return res.status(400).json({
                success:false,
                message:"Please fill all required details"
            })
        }

        //2. validation on image
        const supportedTypes=["jpeg","jpg","png"];
        const fileType=file.name.split('.')[1].toLowerCase();
        console.log(fileType);

        //check wehther the format is supported or not ?
        if(!isFileSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"File type not supported",
            })
        }

        //if file format is supported then upload it to the cloudinary.
        const respone=await uploadToCloudinary(file,"Instagram");

        //3. Create entry in Post db
        const post=await Post.create({
            title:title,
            createdBy:token.id,
            postImage:respone.secure_url,
        })

        //4. Check whether entry is created or not
        if(!post){
            return res.status(400).json({
                success:false,
                message:"Error occured while creating a post",
            })
        }

        //5. now update the User database
        const updatedUser=await User.findByIdAndUpdate(
                    {_id:token.id},
                    {
                        $push:{
                            posts:post._id,
                        }
                    },
                    {new:true}).populate("posts").exec();
        

        //6. return success response
        return res.status(200).json({
            success:true,
            message:"Post has been created successfully",
            data:post,
        })
    
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occured while creating the post",
        })
    }
}

//editPost 
exports.editPost = async (req, res) => {
    try{
        // 1. Get title, body, and post ID from req.body
        const { title, body, post } = req.body;

        // 2. Validate the title, body, and post ID
        if(!title || !body || !post){
            return res.status(400).json({
                success: false,
                message: "Please fill all details again",
            });
        }

        // 3. Fetch the user token
        const token = req.user;

        // 4. Validate the token
        if(!token){
            return res.status(400).json({
                success: false,
                message: "Empty token",
            });
        }

        // 5. Fetch the post to check ownership
        const existingPost = await Post.findById(post);

        // 6. Check if the post exists
        if(!existingPost){
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        // 7. Check if the user making the request is the creator of the post
        if(existingPost.createdBy.toString() !== token.id) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to edit this post",
            });
        }

        // 8. Update the post
        const editedPost = await Post.findByIdAndUpdate(
            post,
            {
                title: title,
                body: body,
            },
            { new: true }
        );

        // 9. Check whether the post is edited or not
        if (!editedPost) {
            return res.status(400).json({
                success: false,
                message: "Post not edited",
            });
        }

        // 10. Return the success response
        return res.status(200).json({
            success: true,
            message: "Post has been edited successfully",
            data: editedPost,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred in editing the post",
        });
    }
};

//deletePost
exports.deletPost=async(req,res)=>{
    try{
        //1. fetch the post id
        const {post}=req.body;

        //2. validate the post
        if(!post){
            return res.status(400).json({
                success:false,
                message:"Please give the post id carefully",
            })
        }

        //3.Fetch the user token becuause only creator have access to delete the post
        const token=req.user;
        
        //4. validate the token
        if(!token){ 
            return res.status(400).json({
                success:false,
                message:"Invalid token",
            })
        }
        
        //5. Find the post wether it exist in post model or not
        const existPost=await Post.findById(post);


        //6. Validate it
        if(!existPost){
            return res.status(400).json({
                success:false,
                message:"Post doesn't exists in the Post model",
            })
        }

        // 5. Check if the user making the request is the creator of the post
        if(existPost.createdBy.toString() !== token.id) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to delete this post",
            });
        }

        //8. Delete the post from post model
        const deletedPost=await Post.findByIdAndDelete(post);

        //9. check wether the post has been deleted or not
        if(!deletedPost){
            return res.status(400).json({
                success:false,
                messsage:"Post is not deleted ",
            })
        }

        //10. delete the post from User model
        const updatedUser=await User.findByIdAndUpdate(
            {_id:token.id},
            {
                $pull:{
                    posts:post,
                }
            },
            {new:true}).populate("posts").exec();

        //11. check wether updation is done or not
        if(!updatedUser){
            return res.status(400).json({
                success:false,
                message:"Post in User is not updated",
            })
        }

        //12. return success respone
        return res.status(200).json({
            success:true,
            message:'Post has been deleted successfully',
            data:updatedUser
        })

    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:"Error occured while deleting the post",
        })
    }
}

//getAllPost
exports.getAllPost=async(req,res)=>{
    try{
        //1. Get all post
        const allPost=await Post.find({}).populate("createdBy").exec();

        //2. Check wether the post got or not
        if(!allPost || allPost.length===0){
            return res.status(204).json({
                success:false,
                message:"No Post Found",
            })
        }
        
        //3. return success response
        return res.status(200).json({
            success:true,
            message:"All Posts fetched successfullly",
            data:allPost,
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error: Error occured while getting all post",
        })
    }
}