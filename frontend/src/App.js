import React from "react";
import { Routes, Route, Navigate, Outlet, BrowserRouter } from "react-router-dom";
import './components/Asserts/style.css';
import Car from "./components/Cars/car";
import Category from "./components/Categories/category";
import Dashboard from "./components/Dashboard/dashboard";
import Layout from "./components/Layout/layout";
import Login from './components/User/login';

function PrivateRoute({ component: Component, ...rest }) {
  const storedValue = localStorage.getItem("token");
  const isAuthenticated = storedValue ? true : false
  const redirectTo = "/login";
  if (isAuthenticated) {
    return (
      <>
        <Layout />
        <Outlet />
      </>
    )
  } else {
    return <Navigate to={redirectTo} />
  }

}
function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        {/* public routes */}
        <Route element={<PrivateRoute />} >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/categories" element={<Category />} />
          <Route path="/cars" element={<Car />} />
        </Route>
        {/* protected routes */}

      </Routes>
    </BrowserRouter>

  );

}
export default App