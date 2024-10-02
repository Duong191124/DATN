import { Outlet } from "react-router-dom";
import Header from "./component/layout/header/header";
import "./global.css";
import Footer from "./component/layout/footer/footer";
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
