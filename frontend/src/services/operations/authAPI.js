import toast from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { authEndpoints } from "../apis";

const {
    SIGNUP_API,
    LOGIN_API
} =authEndpoints;

export function signUp(signUpData,navigate,setLoading){
    const signIn=async ()=>{
       try{
        setLoading(true);
        const response=await apiConnector("post",SIGNUP_API,signUpData);
        console.log("Signup response.....",response);

        if(!response){
            throw new Error(response.data.message);
        }
        toast.success("Account Created Successfully");
        navigate("/");
        toast.success("Please login");
       }
       catch(error){
        console.log("SIGNUP ERROR.....",error);
        toast.error(error.response.data.message)
        navigate("/signup")
       }
       setLoading(false);
    }
    signIn();
}

export function logIn(loginData,navigate,setLoading){
    const login=async ()=>{
        setLoading(true);
        try{
            const response=await apiConnector("post",LOGIN_API,loginData);

            if(!response){
                throw new Error("Login response....",response);
            }
            toast.success("Logged in Successfully");
            localStorage.setItem("token",JSON.stringify(response.data.token));
            localStorage.setItem("user",response.data.user);
            navigate("/feed");
        }
        catch(error){
            console.log("Errror occured while log in");
            console.log(error);
            navigate("/");
            toast.error(error.response.data.message)
        }
        setLoading(false);
    }
    login();
}

export function logout(navigate){
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged Out");
        navigate("/");
}