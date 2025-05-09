import { combineReducers } from "@reduxjs/toolkit";
import refreshReducer from "../slices/refreshSlice";
import userReducer from "../slices/profileSlice"
import createPostReducer from "../slices/createPostSllce";

const rootReducer=combineReducers({
    refresh:refreshReducer,
    user:userReducer,
    createPost:createPostReducer
})

export default rootReducer;