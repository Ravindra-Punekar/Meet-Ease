import "./App.css";
import Home from "./pages/Home/Home";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import React, { Children, useState } from "react";
import { useSelector } from "react-redux";


import Navigation from "./components/shared/Navigation/Navigation";
import Loader from "./components/shared/Loader/Loader";

import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Rooms from "./pages/Rooms/Rooms";
import Room from "./pages/Room/Room";

import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";



function App() {
    
  //call refresh endpoint 
  const { loading } =useLoadingWithRefresh();  
  return loading?(
     <Loader message="Loading, Please Wait"/>
  ):(

    
    <BrowserRouter>
      <Navigation />

      <Routes>
               
        <Route element={ <GuestRoute/> }>
          <Route element={ <Home/>} path="/" exact/>
          <Route element={ <Authenticate/>} path="/authenticate"/>
        </Route>

        <Route element={ <SemiProtectedRoute/> }>
          <Route element={ <Activate/>} path="/activate" />
        </Route>
        
        {/* Below partially works, outlet doesent work  */}
        <Route element={ <ProtectedRoute/> }>
          <Route element={ <Outlet/> }>
            <Route element={ <Rooms/> } path="/rooms" />
            <Route element={ <Room/> } path="/room/:id" />
          </Route>
        </Route>

      </Routes>

    </BrowserRouter>
  );
}


const GuestRoute = ({children}) => {
  const { isAuth } = useSelector((state) => state.auth); //state is from redux store

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
  
//Explain the above code  in detail 
/*
  1. GuestRoute:
    - If user is authenticated, redirect to rooms page
    - If user is not authenticated, render children (Home and Authenticate)
  2. SemiProtectedRoute:
    - If user is not authenticated, redirect to home page
    - If user is authenticated and not activated, render children (Activate)
    - If user is authenticated and activated, redirect to rooms page
  3. ProtectedRoute:
    - If user is not authenticated, redirect to home page 
    - If user is authenticated and not activated, redirect to activate page
    - If user is authenticated and activated, render children (Rooms and Room)

  4. Outlet:
    - Outlet is used to render nested routes
    - Outlet is used in ProtectedRoute to render Rooms and Room
    - Outlet is used in GuestRoute to render Home and Authenticate
    - Outlet is used in SemiProtectedRoute to render Activate

  5. Navigate:
    - Navigate is used to redirect to a route
    - Navigate is used in GuestRoute to redirect to rooms page if user is authenticated
    - Navigate is used in SemiProtectedRoute to redirect to activate page if user is authenticated and not activated
    - Navigate is used in ProtectedRoute to redirect to activate page if user is authenticated and not activated

  6. useSelector:
    - useSelector is used to access the state
    - useSelector is used in GuestRoute to check if user is authenticated
    - useSelector is used in SemiProtectedRoute to check if user is authenticated and activated
    - useSelector is used in ProtectedRoute to check if user is authenticated and activated

    
*/