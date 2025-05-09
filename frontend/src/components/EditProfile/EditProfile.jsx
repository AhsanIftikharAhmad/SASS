import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import { updateAdditionalDetails } from '../../services/operations/userAPI';
import { getUser } from '../../services/operations/postAPI';
import toast from 'react-hot-toast';

const EditProfile = () => {
    const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;
    const navigate=useNavigate();
    const [profile, setProfile] = useState({
        gender: "male",
        dateOfBirth: "",
        about: "",
        dp:null
    });
    const [user,setUser]=useState({});

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUser(token)
                setUser(response.data.data);
                //console.log(response.data.data)
            } catch (error) {
                console.log("Error occurred while fetching the user details:", error);
            }
        };
    
        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value,files } = e.target;
        if(files && files[0]){
            setProfile({
                ...profile,
                [name]:files[0]
            });
        }else{
            setProfile({
                ...profile,
                [name]:value,
            });
        }
    };

    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(!profile.gender || !profile.about){
            toast.error("Please update the details")
            return;
        }
        if(!profile.gender)
            setProfile({
               dateOfBirth:user.additionDetails.dateOfBirth
            })

        try{
            const formData=new FormData();
            formData.append('gender',profile.gender);
            formData.append('dateOfBirth',profile.dateOfBirth);
            formData.append('about',profile.about);
            formData.append('dp',profile.dp);

            updateAdditionalDetails(formData,navigate,token);
        }catch(error){
            console.log("Error occured while updating the user detalis");
        }  
    }

    return (
        <div className='flex flex-col sm:w-[70%] w-full items-start justify-center m-5 my-8 border-2 px-5 py-10'>
            <h1 className='text-xl font-bold'>Edit Profile</h1>
            <div className='bg-gray-200/80 rounded-2xl flex flex-col sm:flex-row gap-2 sm:items-center justify-between sm:w-[90%] w-full overflow-hidden  p-5 mt-5'>
                <div className='flex items-center gap-4 '>
                    <img src={profile.dp? URL.createObjectURL(profile.dp): user.image} alt="" className='w-[50px] h-[50px] rounded-full' />
                    <div>
                        <h1>{user.fullName}</h1>
                        <h2>{user.userName}</h2>
                    </div>
                </div>
                <div>
                    <input type="file" name='dp' id='fileToUpload' onChange={handleChange} />
                </div>
            </div>

            <div className='mt-5 w-full'>
                <h1 className='text-xl font-bold'>About</h1>
                <input
                    type="text"
                    name="about"
                    value={profile.about}
                    onChange={handleChange}
                    placeholder={user.additionDetails==undefined ? "about": user.additionDetails.about}
                    className='w-[90%] px-2 py-2 border-[1px] mt-1 rounded-md'
                />
            </div>
            <div className='mt-5 w-full '>
                <h1 className='text-xl font-bold'>Gender</h1>
                <div className='flex gap-5 mt-3'>
                    <div className='flex gap-2 items-center'>
                        <input
                            type="radio"
                            id='male'
                            name='gender'
                            value={"male"}
                            checked={profile.gender === 'male'}
                            onChange={handleChange}
                        />
                        <label htmlFor="male">Male</label>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <input
                            type="radio"
                            id='female'
                            name='gender'
                            value={"female"}
                            checked={profile.gender === 'female'}
                            onChange={handleChange}
                        />
                        <label htmlFor="female">Female</label>
                    </div>
                </div>
            </div>

            <div className='mt-5 w-full'>
                <h1 className='text-xl font-bold'>Date of Birth</h1>
                <input
                    type='date'
                    name="dateOfBirth"
                    value={profile.dateOfBirth? profile.dateOfBirth : user.additionDetails && user.additionDetails.dateOfBirth ? user.additionDetails.dateOfBirth : ''}
                    onChange={handleChange}
                    placeholder="Select date"
                    className='w-[90%] px-2 py-2 border-[1px] mt-1 rounded-md'
                />

            </div>

            <div className='w-full flex justify-end mt-5 pr-10'>
                <button 
                onClick={handleSubmit}
                className='px-20 py-2 bg-blue-400 rounded-xl text-white hover:bg-blue-600'>Submit</button>
            </div>
        </div>
    );
};

export default EditProfile;
