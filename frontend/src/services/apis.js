const BASE_URL="http://ahsaninsta.azurewebsites.net/api/v1"

//Auth endpoints
export const authEndpoints={
    SIGNUP_API:BASE_URL+"/signup",
    LOGIN_API:BASE_URL+"/login"
}

//post endpoints
export const postEndpoints={
    CREATE_POST_API:BASE_URL+"/createPost",
    GET_ALL_POST_API:BASE_URL+"/getAllPost",
    DELETE_POST_API:BASE_URL+"/deletePost",
    EDIT_POST_API:BASE_URL+"/editPost"
}

//like and comments endpoinst
export const likeCommentsEndpoints={
    LIKE_API:BASE_URL+"/like",
    DISLIKE_API:BASE_URL+"/dislike",
    CREATE_COMMENT_API:BASE_URL+"/createComment",
    EDIT_COMMENT_API:BASE_URL+"/editComment",
    DELETE_COMMENT_API:BASE_URL+"/deleteComment",
    VIEW_COMMENT_API:BASE_URL+"/veiwComments",
}

//save post
export const savePostEndpoints={
    SAVE_POST_API:BASE_URL+"/savePost",
}

//follow user
export const followUserEndpoints={
    FOLLOW_USER_API:BASE_URL+"/follow",
    GET_ALL_USER_API:BASE_URL+"/allUsers",
    GET_USER_NOT_FOLLOWED:BASE_URL+"/userNotFollowed",
}

//user additional deatils end poinst
export const updateAddDeatailsEndpoints={
    CREATE_ADDITIONAL_DETAILS:BASE_URL+"/editProfile"
}

export const getUserEndpoints={
    GET_USER_API:BASE_URL+"/findCurrentUser",
}