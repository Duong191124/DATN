import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { createRoot } from 'react-dom/client'
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { AuthWrapper } from './component/context/auth.context.jsx';
import HomePage from "./pages/home.jsx";
import ProductPage from "./pages/product.jsx";
import ProductDetail from "./pages/product_detail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/product",
    element: <ProductPage />
  },
  {
    path: "/product-detail",
    element: <ProductDetail />
  }
]);


createRoot(document.getElementById('root')).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
)
