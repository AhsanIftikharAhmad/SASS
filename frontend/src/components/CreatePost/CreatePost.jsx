import React, { useState } from 'react';
import dp from '../assests/dp.jpg';
import { RxCrossCircled } from "react-icons/rx";
import { createPost } from '../../services/operations/postAPI';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCreatePost } from '../../slices/createPostSllce';

const CreatePost = () => {
    const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;
    const dispatch=useDispatch();
    const user=useSelector((state)=>state.user.user)

    const [postData, setPostData] = useState({
        title: "",
        image: null,
    });
    const navigate = useNavigate();

    const changeHandler = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setPostData({
                ...postData,
                [name]: files[0], // Store the file object itself
            });
        } else {
            setPostData({
                ...postData,
                [name]: e.target.value,
            });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            // Create form data -> to send the image in form of files
            const formData = new FormData();
            formData.append('title', postData.title);
            formData.append('image', postData.image);

            // Calling createPost function with form data
            createPost(formData, navigate,token);
            dispatch((setCreatePost(false)));
        } catch (error) {
            console.error("Error creating post:", error);
           
        }
    };

    const cancelCreatePost=()=>{
        dispatch(setCreatePost(false));
    }

    return (
        <div className='w-[100vw] h-[100vh]  flex  justify-center items-center'>
            <div className='md:w-[60vw] md:h-[75vh] h-screen bg-white rounded-2xl relative'>
                <h1 className='py-2 font-semibold text-center'>Create a new Post</h1>
                <div onClick={cancelCreatePost} className='absolute text-3xl top-2 right-2 cursor-pointer 0'>
                    <RxCrossCircled/>
                </div>
                <div className='h-[1px] w-full bg-black'></div>
                <div className='w-full flex items-center md:justify-start flex-col md:flex-row'>
                    {/* left */}
                    <div className='md:w-[50%] p-2'>
                        <h1 className="text-2xl font-bold text-center mb-2">Upload an Image</h1>
                        <div className='md:h-[340px] flex justify-center w-[100%] overflow-hidden '>
                            <img src={postData.image ? URL.createObjectURL(postData.image): dp} alt="" className='h-[100%] object-cover ' />
                        </div>
                        <form className='container mx-auto p-4'>
                            <input
                                onChange={changeHandler}
                                type="file" name="image" id="fileToUpload" className="mb-4"
                            />
                            <p>Upload a *png, *jpeg, *jpg image for a post</p>
                        </form>
                    </div>
                    {/* right */}
                    <div className='p-2 flex-1 w-full'>
                        {/* admin */}
                        <div className='flex gap-2 items-center font-semibold'>
                            <img src={user?.image} alt="" className='w-[40px] h-[40px] rounded-full' />
                            <h1>{user?.fullName}</h1>
                        </div>
                        <form className='mt-4'>
                            <textarea
                                onChange={changeHandler}
                                value={postData.title}
                                className='border-[1px] w-[100%] p-2' placeholder='Write a caption' name="title" id="" rows="9"
                            />
                            <div className='text-xl hidden md:block'>
                                😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 😉 😌 😍 😘 😗 😙 😚 ☺️ 🙂 🤗 🤩 🤔 🤨 😐 😑 😶 🙄
                            </div>
                        </form>
                    </div>
                </div>
                <div onClick={submitHandler} className='flex justify-end pr-4'>
                    <button type="submit" name='Post' className='bg-blue-500 text-white px-7 py-2 mt-2 rounded-lg'>
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatePost;
