import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar/Sidebar'
import CreatePost from './CreatePost/CreatePost'
import {useSelector} from 'react-redux'

const Layout = () => {
  const createPost=useSelector((state)=>state.createPost.value);
  useEffect(()=>{
    //console.log("Create Post",createPost);
  },[createPost])
  
  return (
    <>
        <div className={`flex justify-between ${createPost ? "h-[100vh] overflow-hidden" : ""}`}>
        {/* sidebar */}
            <div className='hidden sm:block bg-opacity-25 '>
                <Sidebar/>
            </div>
            <Outlet/>
        </div>
        {
          createPost && <div className='absolute top-0 bg-gray-500/[.5]'>
          <CreatePost/>
          </div>
        }
        
    </>
 
  )
}

export default Layout