import React,{useState,useEffect} from 'react'
import PostCard from './PostCard'
import TopNav from '../Navbar/TopNav'
import BottomNav from '../Navbar/BottomNav'
import { getAllPost, getUser } from '../../services/operations/postAPI'
import {useDispatch, useSelector} from "react-redux"
import FollowCard from '../Common/FollowCard'
import { setUserInfo } from '../../slices/profileSlice'
import Comment from './Comment'
import { userNotFollowed } from '../../services/operations/userAPI'

const Post = () => {
  const token = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;

  const [posts, setPosts] = useState([]);
  const refresh=useSelector((state)=>state.refresh.postRefresh);
  const dispatch=useDispatch();
  const [userId,setUserId]=useState({});
  const [commData,setCommData]=useState({});

  const [userNotFollow,setUserNotFollow]=useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPost(token);
        setPosts(response.data.data?.reverse());

        const userData=await getUser(token);
        setUserId(userData.data.data);
        //console.log(userData)
        dispatch(setUserInfo(userData.data.data));
      } catch (error) {
        console.log("Error occurred while fetching the posts:", error);
      }

      //get user data who are not followed
      try{
        const response=await userNotFollowed(token);
        //console.log(response.data.data);
        setUserNotFollow(response.data.data)
      }catch(error){
        console.log("Error in fetching the user who are not followed");
      }
    };
    
    fetchData();
  }, [refresh]);

  useEffect(()=>{
    //console.log(userId)
  },[userId])

  if(Object.keys(commData).length !== 0){
    return <div >
      <Comment post={commData} setCommData={setCommData} commData={commData} />
    </div>
  }

  return (
    <>
        <div className='mt-2 max-w-[500px] mx-auto  px-2'>
          <TopNav/>
          {
            posts?.map((post,ind)=>{
              return <PostCard  post={post} key={ind} setCommData={setCommData}/>
            })
          }
          <BottomNav/>
        </div>

        {/* sidebar */}
        <div className='py-8 w-[350px] px-4 hidden sm:block border-2 sticky right-0'>
          <FollowCard user={userId} choice={"follower"}/>

          <h1 className='mt-5 font-semibold'>Suggested </h1>
          <div className='mt-5 flex flex-col gap-2'>
            {
              userNotFollow && userNotFollow.map((user,ind)=>{
                return (
                  <div key={ind}>
                    <FollowCard user={user}/>
                  </div>
                )
              })
            }
          </div>
          
        </div>

    </>
    
  )
}

export default Post