import { Outlet } from "react-router-dom";
import "./global.css";
import Header from "./component/layout/user/header/header";
import Footer from "./component/layout/user/footer/footer";
import ScrollToTop from "./component/layout/content/home/scroll";

function App() {
  return (
    <>
      <Header />
      <ScrollToTop />
      <Outlet />
      <Footer />
    </>
  );
}

export default App;
