import React from "react";
import { Outlet } from "react-router-dom";
import bgImage from "../assets/images/bg.jpg";
export const LoginLayout = () => {
  return (
    <div
      style={{ fontFamily: "Montserrat" }}
      className="  bg-contain bg-repeat bg-fixed"
    >
      <Outlet />
    </div>
  );
};
