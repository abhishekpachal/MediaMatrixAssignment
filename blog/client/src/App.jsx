import React from "react";
import AppRoutes from "./Routes";
import { ToastContainer } from "react-toastify";
import NavBar from "./components/NavBar";

const App = () => {
  return (
    <>
      <NavBar />
      <AppRoutes />
      <ToastContainer theme="colored" />
    </>
  );
};

export default App;
