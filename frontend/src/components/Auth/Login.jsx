import React, { useState } from 'react'
import text_logo from "../assests/text_logo.png"
import login_screenshots from "../assests/login_screeenshot.png"
import { Link, useNavigate } from 'react-router-dom'
import { logIn } from '../../services/operations/authAPI'
import Loading from '../Loader/Loading'

const Login = () => {
    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);

    const [loginData,setLoginData]=useState({
        userName:"",
        password:""
    });

    const handleSubmit=(e)=>{
        e.preventDefault();
        logIn(loginData,navigate,setLoading);
    }

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setLoginData({
            ...loginData,
            [name]:value,
        })
    }

    if(loading)
        return <Loading/>
  return (
    <div className='w-[100vw] h-[100vh] flex  justify-center items-center gap-6 px-2 bg-zinc-100'>
        <div className='md:block hidden'>
            <img src={login_screenshots} alt=""  className='h-[440px]' />
        </div>
        <div>
            <div className='w-[95vw] sm:w-[400px] border-[1px] p-3 rounded-md border-black'>
                <div className='flex justify-center flex-col items-center p-2'>
                    <img src={text_logo} alt="" className='w-[200px]' />
                </div>
                {/* send data from to user routes */}
                <form 
                onSubmit={handleSubmit}
                action="" method='post' className='flex flex-col gap-2'>
                    <input type="text" placeholder='username' name='userName' value={loginData.userName} onChange={handleChange} className='border-[1px] rounded-md p-2 ' />
                    <input type="password" placeholder='Enter your Password' name='password' value={loginData.password} onChange={handleChange}  className='border-[1px] rounded-md p-2 ' />
                    <input type="submit" value={"Login"} className='w-full bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-md cursor-pointer'/>
                </form>
                <div className='text-blue-700 text-sm text-center p-2 pt-3'>
                    <a href="#">Forgot your password</a>
                </div>
                
            </div>

            <div className='w-full sm:w-[400px] flex justify-between mt-2 px-5 border-[1px] border-black rounded-md py-5 mb-4'>
                    <p>Don't have an account ?</p>
                    <Link to={"/signup"} className='text-blue-900 hover:text-blue-500'>Sign up</Link>
            </div>
        </div>

        
    </div>
  )
}

export default Login