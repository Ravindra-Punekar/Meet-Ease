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
import Rooms from "./pages/Rooms/Rooms";

import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import React, { Children, useState } from "react";
import { useSelector } from "react-redux";


function App() {
 
 
  return (
    <BrowserRouter>
      <Navigation />

      <Routes>
       
        {/* <Route path="/" element={
            isAuth? (
              <Navigate to={{ pathname: "/rooms" }} />
            ): <Home/>
        } /> */}

        
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


const GuestRoute = ({children}) => {
  const { isAuth } = useSelector((state) => state.auth);

  return (
    isAuth? (
        <Navigate to={'/rooms'} replace/>
        ) : (
           <Outlet/>
        )
  )
};

const SemiProtectedRoute = ({children}) => {
  const { user, isAuth } = useSelector((state) => state.auth);

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
  const { user, isAuth } = useSelector((state) => state.auth);

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
  