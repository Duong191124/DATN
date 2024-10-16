import { Outlet } from "react-router-dom";
import "./global.css";
import NavbarAdmin from "./component/layout/navbar/navbar";
import HeaderAdmin from "./component/layout/user/header/header.admin";

function AppAdmin() {
  return (
    <>
      <div className="app-container">
        <HeaderAdmin />
        <div className="main">
          <div className="sidebar">
            <NavbarAdmin />
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
