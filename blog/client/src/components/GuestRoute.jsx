import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = ({}) => {
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  return loggedIn ? <Navigate to="/home" /> : <Outlet />;
};

export default GuestRoute;
