import React from "react";
import { Outlet } from "react-router-dom";
import UserHeader from "./UserHeader";
import UserFooter from "./UserFooter";

export const Layout = () => {
  return (
    <div className="bg-[#ffffff] flex flex-col min-h-screen">
      <UserHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <UserFooter />
    </div>
  );
};
