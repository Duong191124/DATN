import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { AuthWrapper } from "./component/context/auth.context.jsx";
import App from "./App.jsx";
import Home from "./component/layout/content/home/home.jsx";
import ProductPage from "./pages/product.jsx";
import ProductDetail from "./pages/product.detail.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },

    ],
    // element: <HomePage />
  },
  {
    path: "/product-detail",
    index: true,
    element: <ProductDetail />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/products",
    element: <ProductPage />,
  },
]);

createRoot(document.getElementById('root')).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
)
