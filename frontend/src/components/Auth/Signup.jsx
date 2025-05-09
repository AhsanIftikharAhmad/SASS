import React, { useState } from 'react'
import text_logo from "../assests/text_logo.png"
import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../../services/operations/authAPI'

const Signup = () => {
    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);

    //take the value from the signup form and send it the required routes.
    const [signUpData,setSignUpData]=useState({
        userName:"",
        fullName:"",
        email:"",
        password:"",
    })

    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log("Signup form submitted: ",signUpData);
        signUp(signUpData,navigate,setLoading);
    }

    const handleDataChange=(e)=>{
        const {name,value}=e.target;
        setSignUpData({
           ...signUpData,
           [name]:value
        })
    }

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col justify-center items-center px-2 bg-zinc-100'>       
        <div className='w-full sm:w-[400px] border-[1px] p-3 rounded-md border-black'>
            <div className='flex justify-center flex-col items-center p-2'>
                <img src={text_logo} alt="" className='w-[200px]' />
                <p className='text-center'>Sign up to see photos and videos from your friends.</p>
            </div>
            {/* send data from to user routes */}
            <form 
            onSubmit={handleSubmit}
            action="" method='post' className='flex flex-col gap-2'>
                <input type="text" placeholder='Username' name='userName' value={signUpData.userName} onChange={handleDataChange} className='border-[1px] rounded-md p-2 ' />
                <input type="text" placeholder='Full Name' name='fullName' value={signUpData.fullName} onChange={handleDataChange} className='border-[1px] rounded-md p-2 ' />
                <input type="email" placeholder='Enter your email' name='email' value={signUpData.email} onChange={handleDataChange} className='border-[1px] rounded-md p-2 ' />
                <input type="password" placeholder='Create a Password' name='password' value={signUpData.password} onChange={handleDataChange} className='border-[1px] rounded-md p-2 ' />
                <div className='p-2 text-center text-sm'>
                    <p>By signing up, you agree to our <a href="#" className='text-blue-600 hover:underline'>Terms</a> , <a href="#" className='text-blue-600 hover:underline'>Privacy Policy</a> and <a href="#" className='text-blue-600 hover:underline'>Cookies Policy</a>. </p>
                </div>
                <input type="submit" value={"Sign Up"} className='w-full bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-md cursor-pointer'/>
            </form>
        </div>

        <div className='w-full sm:w-[400px] flex justify-between mt-2 px-5 border-[1px] border-black rounded-md py-5'>
                <p>Have an Account ?</p>
                <Link to={"/"}>Login</Link>
        </div>
    </div>
  )
}

export default Signup