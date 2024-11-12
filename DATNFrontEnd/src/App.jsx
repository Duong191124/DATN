import { Outlet } from "react-router-dom";
import "./global.css";
import Header from "./component/layout/user/header/header";
import Footer from "./component/layout/user/footer/footer";
import { CartProvider } from "./component/context/cart.context";

function App() {
    return (
        <CartProvider>
            <Header />
            <Outlet />
            <Footer />
        </CartProvider>
    );
}

export default App;