import { Outlet } from "react-router-dom";
import "./global.css";
import HeaderAdmin from "./component/layout/user/header/header.admin"
import NavbarAdmin from "./component/layout/navbar/navbar"
import { useState } from "react";

function AppAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <>
      <div className="app-container">
        <HeaderAdmin collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="main">
          <div className="sidebar">
            <NavbarAdmin collapsed={collapsed} />
          </div>
          <div className="content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default AppAdmin;
