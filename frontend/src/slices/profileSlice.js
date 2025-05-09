import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:"",
};

const profileSlice=createSlice({
    name:"user",
    initialState:initialState,
    reducers:{
        setUserInfo(state,value){
            state.user=value.payload;
        },
    }
})

export const {setUserInfo}=profileSlice.actions;

export default profileSlice.reducer;