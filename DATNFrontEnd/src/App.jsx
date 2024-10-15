import { Outlet } from "react-router-dom";
import "./global.css";
import Header from "./component/layout/user/header/header";
import Footer from "./component/layout/user/footer/footer";
import HeaderAdmin from "./component/layout/user/header/header.admin";
import NavbarAdmin from "./component/layout/navbar/navbar";
function App() {
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

export default App;
