import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { followUserEndpoints, updateAddDeatailsEndpoints } from "../apis";

const {
    CREATE_ADDITIONAL_DETAILS,
}=updateAddDeatailsEndpoints;

const {
    FOLLOW_USER_API,
    GET_USER_NOT_FOLLOWED,
    GET_ALL_USER_API,
}=followUserEndpoints


export function updateAdditionalDetails(profileData,navigate,token){
    const create=async()=>{
        try{
            const response=await apiConnector("post",CREATE_ADDITIONAL_DETAILS,profileData,
            {
                Authorization:`Bearer ${token}`
            })
            if(!response){
                throw new Error("Error occured in user details",response);
            }
            //console.log(response)
            navigate("/user")
        }catch(error){
            console.log("Error occured while updating the user additional detials");
            console.log(error);
        }
    }
    const myPromise = create();

    toast.promise(myPromise, {
        loading: 'Updating...',
        success: 'Updated',
        error: 'Update Fail !',
    });
}

export const userNotFollowed=async(token)=>{
    try{
        const response=await apiConnector("post",GET_USER_NOT_FOLLOWED,"",
        {
            Authorization:`Bearer ${token}`
        })

        if(!response){
            throw new Error("Didn't fetch the user");
        }

        return response;
    }catch(error){
        console.log("Error in not followed user");
        console.log(error);
    }
}

export const getAllUsers=async(token)=>{
    try{
        const response=await apiConnector("post",GET_ALL_USER_API,"",
        {
            Authorization:`Bearer ${token}`
        })

        if(!response)
            throw new Error("Error in fetching the user");

        return response;
    }catch(error){
        console.log("Error in fetching the user")
    }
}

export const followUser=async(heroId,token)=>{
    try{
        const response=await apiConnector("post",FOLLOW_USER_API,{heroId:heroId},
        {
            Authorization:`Bearer ${token}`
        })

        if(!response){
            throw new Error("Follow User Error");
        }
        toast.success(response.data.message);
        //console.log(response.data.message)
    }catch(error){
        console.log("Follow Error");
    }
}