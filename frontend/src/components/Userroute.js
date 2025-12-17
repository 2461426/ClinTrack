
// src/routes/ProtectedUserRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import UtilityService from "../services/UtilityService";

const ProtectedUserRoute = ({ children }) => {
   const token = localStorage.getItem("auth_token");
  const isUser = UtilityService.isUser(); // role === 'USER'

  if (!token || !isUser) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedUserRoute;