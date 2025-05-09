const express=require("express");
const router=express.Router();

const { signUp, login } = require("../controllers/Auth");
const {getCurrentUser} =require("../controllers/User");
const {editAdditionalDetails}=require("../controllers/Profile");
const {createPost,editPost,deletPost,getAllPost}=require("../controllers/Post");
const {like,dislike}=require("../controllers/Like");
const {createComment,deleteComment,editComment,viewComment}=require("../controllers/Comment");
const {createTag}=require("../controllers/Tag");
const {savePost}=require("../controllers/SavePost")
const {follow, findUsersNotFollowed, getAllUsers}=require("../controllers/Follow1");

//importing middleware
const {auth}=require("../middleware/auth");

router.post("/signup",signUp);
router.post("/login",login);

router.post("/findCurrentUser",auth,getCurrentUser);

router.post("/editProfile",auth,editAdditionalDetails);

//create post routes
router.post("/createPost",auth,createPost);
router.post("/editPost",auth,editPost);
router.post("/deletePost",auth,deletPost);
router.get("/getAllPost",getAllPost);
router.post("/savePost",auth,savePost);

//like and unlike the post
router.post("/like",auth,like);
router.post("/dislike",auth,dislike);

//comments routes
router.post("/createComment",auth,createComment);
router.post("/deleteComment",auth,deleteComment);
router.post("/editComment",auth,editComment);
router.post("/veiwComments",viewComment);

//tag routes
router.post("/createTag",auth,createTag);

//follow routes
router.post("/follow",auth,follow);
router.post("/allUsers",auth,getAllUsers);
router.post("/userNotFollowed",auth,findUsersNotFollowed);

module.exports=router;