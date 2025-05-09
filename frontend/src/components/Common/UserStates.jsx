import React from 'react'
import { NavLink } from 'react-router-dom'

const UserStates = ({user}) => {
  return (
    <div className='flex gap-5'>
        <p>{`${user?.posts?.length || 0} post`}</p>
        <NavLink
        className={"text-blue-800 hover:text-blue-500"}
        to={"/search"}
        >{`${user?.followers?.length || 0} followers`}</NavLink>
        <NavLink
        className={"text-blue-800 hover:text-blue-500"}
        to={"/search"}
        >{`${user?.following?.length || 0} following`}</NavLink>
    </div>
  )
}

export default UserStates