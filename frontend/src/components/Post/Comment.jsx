import React, { useEffect, useState } from 'react'
import PostCard from './PostCard'
import { viewComment } from '../../services/operations/postAPI';
import { RxCrossCircled } from "react-icons/rx";

const Comment = ({post,setCommData,commData}) => {
  const postId=commData._id;
  //console.log(postId)
  const [comments, setComments] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await viewComment(postId);
        setComments(response.data.data);
      }catch (error){
        console.log("Error occurred while fetching the comments data");
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    //console.log("Comments data == ", comments);
  }, [comments]); 

  
  return (
    <>
      <div className='w-[100vw] h-[100vh] relative sm:absolute top-0 left-0 bg-gray-500/[.5]'>
        <div className='absolute sm:top-[50%] sm:left-[50%] bg-white p-2 py-4 sm:-translate-x-[50%] sm:-translate-y-[50%] w-full sm:w-[80vw] rounded-md '>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 '>
          <PostCard post={post} setCommData={setCommData}/>
          <div className='min-h-[50vh]'>
            <div className='flex justify-between p-2'>
              {/* username */}
              <h1 className='font-semibold text-xl'>Comments</h1>
              <button
              className='text-2xl font-bold'
                onClick={()=>setCommData({})}
              >
                <RxCrossCircled/>
              </button>

            </div>
            
            <div className='bg-gray-500 h-[1px] w-full'></div>

            {/* comments data */}
            {
              comments.length>0 ? comments.map((comment)=>{
                return (
                  <div key={comment._id} className='flex items-center gap-2 mt-4 m-2'>
                    <img src={comment.user.image} alt="" className='w-[50px] h-[50px] rounded-full border-[1px] border-black' />
                    <div>
                      <h1 className='font-semibold'>{comment.user.userName}</h1>
                      <p>{comment.comment}</p>
                    </div>
                  </div>
                )
              }) : <h1 className='font-semibold text-center mt-4'>No comments found</h1>
            }
          </div>
        </div>
      
      </div>
      </div>
    </>
  )
}

export default Comment