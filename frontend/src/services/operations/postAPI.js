import { apiConnector } from "../apiconnector";
import { getUserEndpoints, likeCommentsEndpoints, postEndpoints, savePostEndpoints } from "../apis";
import {toast} from "react-hot-toast"

const {
    GET_ALL_POST_API,
    CREATE_POST_API
}=postEndpoints;

const {
    LIKE_API,
    DISLIKE_API,
    CREATE_COMMENT_API,
    VIEW_COMMENT_API
}=likeCommentsEndpoints;

const {
    SAVE_POST_API
}=savePostEndpoints;

const {
    GET_USER_API
}=getUserEndpoints;

export const getAllPost=async()=>{
    try{
        const response=await apiConnector("get",GET_ALL_POST_API);

        if(!response){
            throw new Error(response.data.message);
        }

        return response;

    }catch(error){
        console.log("Error occured while fetching the post");
        console.log(error);
    }
}

export function createPost(postData,navigate,token){
    const create=async()=>{
        try{
            const response=await apiConnector("post",CREATE_POST_API,postData,
            {
                Authorization: `Bearer ${token}`
            });

            if(!response){
                throw new Error("Error occured",response);
            }

            navigate("/feed");

        }catch(error){
            console.log("Error occured while creating the post");
            console.log(error);
            navigate("/feed");
        }
    }
    const myPromise = create();

    toast.promise(myPromise, {
        loading: 'Posting....',
        success: 'Posted',
        error: 'Post creation Failed',
    });
}

export function createComment(commentData,dispatch,setRefresh,token){
    const doComment=async()=>{
        try{
            const response=await apiConnector("post",CREATE_COMMENT_API,commentData,
            {
                Authorization:`Bearer ${token}`
            })

            if(!response){
                throw new Error("Error occured in comment frontend");
            }
            dispatch(setRefresh());
            toast.success("Comment created");
            
        }
        catch(error){
            console.log("Errror occured in commenting frontend");
            console.log(error);
        }
    }
    doComment();
}

export const viewComment=async(postId)=>{
    try{
        const response=await apiConnector("post",VIEW_COMMENT_API,{postId:postId});
        if(!response){
            throw new Error("Didn't fetch the comments");
        }

        return response;
    }
    catch(error){
        console.log("Error occured while accessing the comments");
        console.log(error);
    }
}

export function doLike(like,dispatch,setRefresh,token){
    const doLike=async()=>{
        try{
            const response= await apiConnector("post",LIKE_API,{postId:like},
            {
                Authorization:`Bearer ${token}`
            });

            if(!response){
                throw new Error("Error occured while liking")
            }
            dispatch(setRefresh());
            toast.success("Liked"); 
        }
        catch(error){
            if(error.response && error.response.status === 409){
                // 409 status code indicates that the post is already liked
                disLike(like);
            } else {
                console.log("Error occurred while liking the post from frontend");
                console.log(error);
            }
        }
    }
    const disLike=async(like)=>{
        try{
            const response=await apiConnector("post",DISLIKE_API,{postId:like},
            {
                Authorization:`Bearer ${token}`
            });

            if(!response){
                throw new Error("Error occured while disliking frontend= ",response);
            }
            dispatch(setRefresh());
            toast.success("Like removed",{
                style:{
                    color:"red"
                }
            });
            console.log(response);
        }
        catch(error){
            console.log("Error occured while disliking the post from frontend");
            console.log(error)
        }
    }
    doLike();
}

//save post-> booksmarks
export const savePost=async(post,dispatch,setRefresh,token)=>{
    try{
        const response=await apiConnector("post",SAVE_POST_API,{postId:post},
        {
            Authorization:`Bearer ${token}`
        })

        if(!response){
            throw new Error(response.data.message);
        }
        
        dispatch(setRefresh());
        toast.success(response.data.message);
    }catch(error){
        console.log("Error occured in Saving the post => ",error);
    }
}

//FOR LATER USER -> NOT UTILISING CURRENTLY

export const getUser=async(token)=>{
    try{
        const response=await apiConnector("post",GET_USER_API,{data:"Pankaj"},
        {
            Authorization: `Bearer ${token}`
        }
        );
        //console.log("User information", response);

        if(!response){
            throw new Error(response.data.message);
        }
        return response;
    }
    catch(error){
        console.log("Error occcured while getting the user");
        console.log(error);
    }
}