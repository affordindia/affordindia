// components/SidebarLayout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const SidebarLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 min-h-screen">
        <Sidebar />
      </div>

      {/* Dynamic Page Content */}
      <div className="w-3/4 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
