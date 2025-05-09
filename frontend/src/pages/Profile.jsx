import React, { useState, useEffect } from 'react';
import dp from '../components/assests/dp.jpg';
import { CiSettings } from "react-icons/ci";
import { IoMdGrid } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTag } from "react-icons/fa6";
import { getUser } from '../services/operations/postAPI';
import UserStates from '../components/Common/UserStates';
import { NavLink, useNavigate } from 'react-router-dom';
import { FcLike } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa";
import BottomNav from '../components/Navbar/BottomNav';
import { logout } from '../services/operations/authAPI';
import Loading from '../components/Loader/Loading';

const Profile = () => {
    const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;
    const navigate=useNavigate();    
    const menuList=[
        {
            name:"posts",
            element:<IoMdGrid/>
        },
        {
            name:"saved",
            element:<FaRegBookmark/>
        },
        {
            name:"reels",
            element:<FaTag/>
        }
    ];
    const [choice,setChoice]=useState("posts");
    const [user, setUser] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [loading,setLoading]=useState(false);
    
    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await getUser(token);
                setUser(response.data.data);
            } catch (error) {
                console.log("Error occurred while fetching the user details:", error);
            }
            setLoading(false);
        };
    
        fetchUser();
    }, [token,choice]);

    useEffect(() => {
        if(choice==="saved")
            setUserPosts(user.savedPosts);
        else{
            setUserPosts(user[choice] || []);
            //console.log(user)
            //console.log(userPosts)
        }
    }, [user,choice]);

    return (
        <>
            <div className='w-[100vw] mx-auto sm:w-[60%] h-screen flex-1 relative'>
                {loading?<Loading/>:
                <div className='mt-8  px-2'>
                    <div className='flex sm:w-[80%] items-center justify-center sm:justify-evenly flex-col sm:flex-row '>
                        {/* left image */}
                        <div className='border-2 sm:w-[150px] w-[110px] h-[110px] sm:h-[150px] overflow-hidden rounded-full'>
                            <img src={user.image ? user.image : dp} alt="user" className='w-full h-full  ' />
                        </div>

                        {/* right */}
                        <div className=' px-5 py-3 flex flex-col sm:justify-between '>
                            <div className='flex flex-wrap gap-8 items-center text-lg'>
                                <h1>{user.userName}</h1>
                                <div className='flex gap-8 items-center'>
                                    <NavLink 
                                    to={"/user/editProfile"}
                                    className='bg-gray-200 p-1 px-5 rounded-md text-sm font-semibold'> Edit Profile</NavLink>
                                    <div className='text-2xl bg-gray-200 p-1 rounded-full cursor-pointer relative group'>
                                        <CiSettings/>
                                        <button 
                                        onClick={()=>logout(navigate)}
                                        className='absolute -right-6 sm:-right-10 text-sm font-semibold bg-red-600 text-white px-4 py-1 rounded-2xl hidden group-hover:block'>Logout</button>
                                    </div>
                                    
                                </div>
                                
                            </div>
                            
                            <div className='hidden sm:block'>
                                <UserStates user={user}/>
                            </div>

                            <div>
                                <h1 className='uppercase font-semibold text-sm'>{user.fullName}</h1>
                                <h2 className='text-sm'>{`${user?.additionDetails?.about || "Bio"}`}</h2>
                            </div>
                        </div>
                    </div>

                    <div className='sm:hidden flex justify-center gap-5'>
                        <UserStates user={user}/>
                    </div>

                    <hr className='sm:mt-10 mt-5' />

                    <div className='text-sm flex justify-center gap-10 mt-2'>
                        {menuList.map((menu, ind) => (
                            <button
                                onClick={()=>setChoice(menu.name)}
                                key={ind}
                                className={`${choice===menu.name ? "font-bold" :"" } flex gap-2 items-center hover:font-bold uppercase`}
                            >
                                {menu.element}
                                <h1>{menu.name}</h1>
                            </button>
                        ))}
                    </div>

                    {/* post shown */}
                    {userPosts.length !== 0 ? (
                        <div className='mt-6 w-full grid grid-cols-3 md:grid-cols-4 gap-1  sm:px-5'>
                            {userPosts.map((post, ind) => (
                                <div key={ind} className='group cursor-pointer  bg-gray-200  max-h-[300px] border-2 flex justify-center relative'>
                                    <img src={choice==="saved" ? post.post?.postImage :post.postImage} alt="" className=' bg-cover h-[100%]  ' />
                                    <div className='hidden group-hover:flex  gap-4 group-hover:absolute justify-center  w-full h-full bg-gray-200 bg-opacity-70'>
                                        <div className='flex gap-1 items-center'>
                                            <h1 className='text-2xl font-bold'><FcLike/></h1>
                                            <div>
                                                {choice==="saved" ? post.post?.likes.length : post.likes?.length}
                                            </div>
                                        </div>
                                        <div className='flex gap-1 items-center'>
                                            <h1 className='text-2xl font-bold'><FaRegComment/></h1>
                                            <div>
                                                {choice==="saved" ? post.post?.comments.length : post.comments?.length}
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='text-4xl text-center mt-5'>No Post found</div>
                    )}
                </div>
                }
                <div className='absolute bottom-0 w-full px-4'>
                    <BottomNav/>
                </div>
                
            </div>
            
        </>
    );
};

export default Profile;
