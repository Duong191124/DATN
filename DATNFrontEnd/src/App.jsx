import { Outlet, useLocation } from "react-router-dom";
// import Header from "./component/layout/header/header";
import "./global.css";
import NavbarAdmin from "./component/layout/navbar/navbar";
import HeaderAdmin from "./component/layout/header/header.admin";
import FooterAdmin from "./component/layout/footer/footer.admin";
import { Breadcrumb } from "antd";


function App() {

  const location = useLocation(); // Get current route path

  // Create an array of breadcrumb items based on the path
  const breadcrumbItems = location.pathname.split("/").filter(path => path).map((path, index) => {
    const url = `/${location.pathname.split("/").slice(1, index + 2).join("/")}`;
    return {
      key: url,
      label: path.charAt(0).toUpperCase() + path.slice(1), // Capitalize first letter
    };
  });

  return (
    <div className="app-container">
      <HeaderAdmin /> 
      <div className="main">
        <NavbarAdmin className="sidebar" /> 
        <div className="content">
          <Breadcrumb
            style={{ margin: '16px 0' }} 
            items={breadcrumbItems}
          />
          <Outlet /> 
        </div>
      </div>
      <FooterAdmin />
    </div>
  );
}

export default App;
