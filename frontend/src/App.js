import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Post from "./components/Post/Post";
import OpenRoute from "./components/Auth/OpenRoute";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";
import PrivateRoute from "./components/Auth/PrivateRoute";
import CommingSoon from "./components/ExceptionHandle/CommingSoon";
import EditProfile from "./components/EditProfile/EditProfile";
import Search from "./pages/Search";
import NotFound from "./components/ExceptionHandle/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>  
          <Route path="/" element={
            <OpenRoute>
              <Login/>
            </OpenRoute>
          }/>
          <Route path="/signup" element={
            <OpenRoute>
              <Signup/>
            </OpenRoute>
          }/>

          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>  
            }>
              <Route path="feed" element={<Post/>}/>  
              <Route path="user" element={<Profile />} />
              <Route path="/user/editProfile" element={<EditProfile/>}/>
              <Route path="/search" element={<Search/>}/>
              <Route path="/message" element={<CommingSoon/>}/>
              <Route path="/reels" element={<CommingSoon/>}/>
          </Route>
            
         <Route path="*" element={<NotFound/>}/>

        </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;
