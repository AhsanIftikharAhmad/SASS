const Profile=require("../models/Profile");
const cloudinary=require('cloudinary');
const User = require("../models/User");

function isFileSupported(type,supportedTypes){
    return supportedTypes.includes(type);
}

//function to upload image to cloudinary
async function uploadToCloudinary(file,folder,quality){
    const options={folder};
    options.resource_type="auto";

    if(quality)
        options.quality=quality;
    return await cloudinary.uploader.upload(file.tempFilePath,options);
}

exports.editAdditionalDetails=async(req,res)=>{
    try{
        //1. extract data
        const {gender,dateOfBirth,about}=req.body;
        const file=req.files?.dp;


        //2. validatation
        if(!gender || !dateOfBirth || !about){
            return res.status(206).json({
                success:false,
                message:"Please all details carefully"
            })
        }

        //validation on image
        const supportedTypes=["jpeg","jpg","png"];
        if(file){
            const fileType=file? file.name.split('.')[1].toLowerCase() :"";
            console.log(fileType);

            //check wether the file is supported or not 
            if(!isFileSupported(fileType,supportedTypes)){
                return res.status(400).json({
                    success:false,
                    message:"File type not supported"
                })
            }
        }
        

        //3. extract the current user from token
        const token=req.user;
        //validate
        if(!token){
            return res.status(400).json({
                success:false,
                message:"Invalid token",
            })
        }

        //4. update the details in Profile models
        const updateProfile=await Profile.findOneAndUpdate(
            {user:token.id},
            {
                gender:gender,
                dateOfBirth:dateOfBirth,
                about:about,
            },
            {new:true});

        //5. check where profile model is upated or not
        if(!updateProfile){
            return res.status(400).json({
                success:false,
                message:"User profile not updated in Profile model"
            })
        }

        //6. update the user db -> NO NEED OF UPDATING THE USER MODEL.  

        //upload the file to cloudinary
        if(file){
            const response=await uploadToCloudinary(file,"Instagram");
            //updating the profile image in User db;

            if(!response){
                return res.status(500).json({
                    success:false,
                    message:"Error occured while uploading dp to cloudinary"
                })
            }

            const user = await User.findOneAndUpdate(
                { 
                    additionDetails: updateProfile._id 
                },
                { 
                    image: response.secure_url 
                },
                { new: true }
            );
        }
        

        //return the success response
        return res.status(200).json({
            success:true,
            message:"User's additional Details has been updated",
            data:updateProfile,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error occurred in updating the User's additinal detial "
        })
    }
}