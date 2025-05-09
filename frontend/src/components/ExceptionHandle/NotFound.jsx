import React from 'react'
import { NavLink } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='text-center'>
        <h1 className='text-3xl font-bold'>404 </h1>
        <h2 className='text-3xl font-semibold'>Page not Found</h2>
        <h2>Get back to home page</h2>
        <div className='mt-4'>
            <NavLink to={"/feed"} className="bg-gray-200 p-2 px-6 mt-5 rounded-2xl">Home</NavLink>
        </div>
        
    </div>
  )
}

export default NotFound