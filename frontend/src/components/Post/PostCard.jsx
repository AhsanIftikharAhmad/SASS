import React, { useEffect, useState } from 'react'
import dp from "../assests/dp.jpg"
import { BsThreeDots } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { PiBookmarkSimpleFill } from "react-icons/pi";
import { PiBookmarkSimpleLight } from "react-icons/pi";
import { createComment, doLike, savePost } from '../../services/operations/postAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setRefresh } from '../../slices/refreshSlice';
import { FcLike } from "react-icons/fc";

const PostCard = ({post, setCommData}) => {
    const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;
    const [commentData,setCommentData]=useState({
        comment:"",
        postId:"",
    })
    const [like,setLike]=useState({
        post:"",
    })

    const dispatch=useDispatch();
    const userId=useSelector((state)=>state.user.user);
    //console.log(userId)

    //console.log(post);
    const date= new Date(post.createdAt);
    const month=["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"];

    //like controller
    const likeHandler=async(post)=>{
        //console.log("Check ",post.title)
        setLike({
            post:post,
        });
    }

    useEffect(()=>{
        if(like.post!==""){
            doLike(like.post,dispatch,setRefresh,token);
        }
    },[like])
   
    // comment controller
    const commentSubmitHandler=(e,post)=>{
        e.preventDefault();
        commentData.postId=post;

        createComment(commentData,dispatch,setRefresh,token)
    }
    const handleChange=(e)=>{
        const {name,value}=e.target;
        setCommentData({
            ...commentData,
            [name]:value,
        })
    }

    //save post controller
    const savePostHandler=(post)=>{
        savePost(post,dispatch,setRefresh,token);
        console.log("Post saved successfully");
    }

  return (
    <div className=' '>
        {/* heading */}
        <div className='border-b-[1px] flex justify-between items-center py-2'>
            {/* profile */}
            <div className='flex gap-2 items-center'>
                <div className='w-[40px] h-[40px] rounded-full overflow-hidden cursor-pointer'>
                    <img 
                    src={post.createdBy.image ? post.createdBy.image :dp} alt="" className='w-[100%] h-[100%]' />
                </div>
                <div className='text-sm cursor-pointer'>
                    <h1>{post.createdBy.fullName}</h1>
                    <p className='text-xs'>{date.getDate()} {month[date.getMonth()]}, {date.getFullYear()}</p>
                </div>
            </div>
            {/* three dot */}
            <div className='text-2xl cursor-pointer'>
                <BsThreeDots/>
            </div>
        </div>
        {/* image */}
        <div className='h-[400px] w-full flex justify-center overflow-hidden bg-gray-200'>
            <img 
            src={post.postImage} alt="" className='h-full w-auto cursor-pointer' />
        </div>
        
        {/* like,comments  */}
        <div className='text-2xl flex justify-between items-center mt-2'>
            <div className='flex gap-4 items-center'>
                {/* like */}
                <div 
                onClick={()=>likeHandler(post)}
                className='flex gap-1 items-center cursor-pointer '>
                    {
                        post.likes.includes(userId._id) ? <FcLike/> : <FaRegHeart/>
                    }
                    <p className='text-sm font-semibold'>{`${post.likes.length} likes`}</p>
                </div>
                <div
                onClick={()=>setCommData(post)}
                className='flex gap-1 items-center cursor-pointer'>
                    <FaRegComment/><p className='text-sm font-semibold'>{`${post.comments.length} comments`}</p>
                </div>
            </div>
            <div
            className='cursor-pointer font-bold'
            onClick={()=>savePostHandler(post._id)}
            >
                {
                    userId.savedPosts?.some(savedPost => savedPost.user === userId._id && savedPost.post._id === post._id)
                        ? <PiBookmarkSimpleFill/> : <PiBookmarkSimpleLight/>
                }
                
            </div>
        </div>
        <div className='text-sm  mt-1'>
            <p className='text-black font-bold pl-1 '>{post.title}</p>
            <form 
            onSubmit={(e)=>commentSubmitHandler(e,post)} className='flex justify-between'>
                <input 
                onChange={handleChange}
                name='comment'
                type="text" id='comment' placeholder='add a comment...' className='w-full px-1 py-1 outline-none' />
                <input type="submit"  value={"Post"} className='text-blue-600 font-semibold cursor-pointer'/>
            </form>
            <div className='w-full h-[0.5px] mx-1 mt-1 bg-gray-600'></div>
        </div>

    </div>
  )
}

export default PostCard
