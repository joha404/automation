// src/routes/RootDirct.jsx
import Home from '@/page/home/Home';
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const RootDirct = () => {
  const user = useSelector((state) => state.user.user);
  const location = useLocation();

  if (user && location.pathname === "/") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Home />;
};

export default RootDirct;
