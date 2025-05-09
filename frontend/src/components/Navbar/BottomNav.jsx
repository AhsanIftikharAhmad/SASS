import React from 'react'
import { GoHome } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { SiYoutubeshorts } from "react-icons/si";
import { BsSend } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const navigate=useNavigate();
  return (
    <div className='text-3xl flex sm:hidden justify-between items-center mt-2 pt-2 pb-3 -mx-1 px-2 sticky bottom-0 bg-white'>
        <GoHome onClick={()=>navigate("/feed")}/>
        <CiSearch onClick={()=>navigate("/search")}/>
        <SiYoutubeshorts onClick={()=>navigate("/reels")}/>
        <BsSend onClick={()=>navigate("/messages")}/>
        <FaRegUserCircle onClick={()=>navigate("/user")}/>
    </div>
  )
}

export default BottomNav