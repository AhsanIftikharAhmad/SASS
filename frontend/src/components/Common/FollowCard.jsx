import React, { useEffect, useState } from 'react'
import dp from "../assests/dp.jpg"
import { followUser } from '../../services/operations/userAPI'

const FollowCard = ({user,choice}) => {
  const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;
  const [follow,setFollow]=useState("Follow");
  const followHandler=async({heroId})=>{
    //console.log(heroId)
    if(follow==="Follow")
      setFollow("Following")
    else
      setFollow("Follow")
    await followUser(heroId,token);
  }

  return (
    <div className='w-[280px] flex justify-between items-center gap-2'>
        <div className='flex gap-2 items-center'>
            <img src={user?.image} alt="" className='w-[48px] h-[48px] rounded-full border-[1px] border-gray-400'/>
            <div>
                <h1 className='font-semibold text-sm'>{user?.fullName}</h1>
                <h2 className='text-sm'>{user?.userName}</h2>
            </div>
        </div>
        
        <button 
    onClick={() => followHandler({ heroId: user?._id })}
    className='text-blue-500 text-sm font-semibold'>
    {choice === "unfollow" ? "Unfollow" : choice === "follow" ? "Follow" : choice==="follower" ? ""  : follow}
</button>
    </div>
  )
}

export default FollowCard