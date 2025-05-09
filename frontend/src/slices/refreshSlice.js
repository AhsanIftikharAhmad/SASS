import {createSlice} from "@reduxjs/toolkit";

const initialState={
    postRefresh:1,
};

const refreshSlice=createSlice({
    name:"postrefresh",
    initialState:initialState,
    reducers:{
        setRefresh(state){
            state.postRefresh+=1;
        }
    }
})

export const {setRefresh}=refreshSlice.actions;
export default refreshSlice.reducer;