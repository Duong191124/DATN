import { Outlet } from "react-router-dom";
import "./global.css";
import Header from "./component/layout/user/header/header";
import Footer from "./component/layout/user/footer/footer";
function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
