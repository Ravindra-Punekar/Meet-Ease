import "./App.css";
import Home from "./pages/Home/Home";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Navigation from "./components/shared/Navigation/Navigation";
// import Register from "./pages/Register/Register";
// import Login from "./pages/Login/Login";
import Rooms from "./pages/Rooms/Rooms";

import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import React, { Children, useState } from "react";

// const isAuth = true;


function App() {
 
  // const [isAuth, setIsAuth ] = useState(null);
  
  // const auth =()=>{
  //   setIsAuth(true);
  // };
  // const Nauth =()=>{
  //   setIsAuth(false);
  // };
 
  return (
    <BrowserRouter>
      <Navigation />

      <Routes>
       
        {/* <Route path="/" element={
            isAuth? (
              <Navigate to={{ pathname: "/rooms" }} />
            ): <Home/>
        } /> */}


        {/* <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} /> */}
       
        
        {/* <Route path="authenticate" element={
          !isAuth? (
              <Authenticate/>
          ):(
            user.activated?(
              <Navigate to={{ pathname: "/rooms" }} />
            ) : (
              <Activate/>
            )
          )
        } /> */}
        
        <Route element={ <GuestRoute/> }>
          <Route element={ <Home/>} path="/" exact/>
          <Route element={ <Authenticate/>} path="/authenticate"/>
        </Route>

        <Route element={ <SemiProtectedRoute/> }>
          <Route element={ <Activate/>} path="/activate" />
        </Route>
        
        <Route element={ <ProtectedRoute/> }>
          <Route element={ <Rooms/> } path="/rooms" />
        </Route>
        
        {/* Below partially works, outlet doesent work  */}
        {/* <Route
          path="/authenticate"
          element={
            <GuestRoute >
              <Authenticate/>
            </GuestRoute>
          }
        /> */}

      </Routes>
    </BrowserRouter>
  );
}

const isAuth = false;
const user={
  activated: false,
};
const GuestRoute = ({children}) => {
  return (
    isAuth? (
        <Navigate to={'/rooms'} replace/>
        ) : (
           <Outlet/>
        )
  )
};
const SemiProtectedRoute = ({children}) => {
  return (
    !isAuth? (
        <Navigate to={'/'} replace/>
        ) : (
           isAuth && !user.activated ?(
            <Outlet/>
           ) : (
            <Navigate to={'/rooms'} replace/>
           )
        )
  )
};
const ProtectedRoute = ({children}) => {
  return (
    !isAuth? (
        <Navigate to={'/'} replace/>
        ) : (
           isAuth && !user.activated ?(
             <Navigate to={'/activate'} replace/>
           ) : (
            <Outlet/>
           )
        )
  )
};

export default App;
  