import { createSlice } from "@reduxjs/toolkit";

const initialState={
    createpost:false,
};

const createPostSlice=createSlice({
    name:"createpost",
    initialState:initialState,
    reducers:{
        setCreatePost:(state,action)=>{
            state.value=action.payload
        }
    }
})

export const {setCreatePost}=createPostSlice.actions;
export default createPostSlice.reducer ;