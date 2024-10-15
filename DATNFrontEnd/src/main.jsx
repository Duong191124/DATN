import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { AuthWrapper } from "./component/context/auth.context.jsx";
import App from "./App.jsx";
import Home from "./component/layout/content/home/home.jsx";
import ProductPage from "./pages/product.jsx";
<<<<<<< HEAD
// import PermissionPage from "./pages/permission.jsx";
=======
import OrderTable from "./component/layout/admin/order/order.table.jsx";
import OrderPage from "./pages/order.jsx";
import CounterSales from "./pages/counter_sales.jsx";
import PermissionPage from "./pages/permission.jsx";
>>>>>>> 5a2884cd93aeab05ed8ca0cc21e068ede8cb0a9c
import ProductDetail from "./pages/product.detail.jsx";
import ColorPage from "./pages/color.jsx";
import SizePage from "./pages/size.jsx";
import CollarPage from "./pages/collar.jsx";
import BrandPage from "./pages/brand.jsx";
import CategoryPage from "./pages/category.jsx";
import SleevePage from "./pages/sleeve.jsx";
import StaffManagement from "./pages/staff.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: false,
        element: <Home />,
      },
      {
        path: "products",
        element: <ProductPage />,
      },
      {
        path: "products/:id",
        element: <ProductDetail />,
      },
      {
        path: "staff",
        element: <StaffManagement />,
      },
      {
        path: "/counter-sales",
        element: <CounterSales />,
      },
      {
        path: "/order",
        element: <OrderPage />,
      },
      {
        path: "/colors",
        element: <ColorPage />,
      },
      {
        path: "/sizes",
        element: <SizePage />,
      },
      {
        path: "/collars",
        element: <CollarPage />,
      },
      {
        path: "/brands",
        element: <BrandPage />,
      },
      {
        path: "/categories",
        element: <CategoryPage />,
      },
      {
        path: "/sleeves",
        element: <SleevePage />,
      },
      {
        path: "/permission",
        element: <PermissionPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
<<<<<<< HEAD
  // {
  //   path: "/permission",
  //   element: <PermissionPage />,
  // },
  {
    path: "/colors",
    element: <ColorPage />,
  },
  {
    path: "/sizes",
    element: <SizePage />,
  },
  {
    path: "/collars",
    element: <CollarPage />,
  },
  {
    path: "/brands",
    element: <BrandPage />,
  },
  {
    path: "/categories",
    element: <CategoryPage />,
  },
  {
    path: "/sleeves",
    element: <SleevePage />,
  },
=======
>>>>>>> 5a2884cd93aeab05ed8ca0cc21e068ede8cb0a9c
]);
createRoot(document.getElementById("root")).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
);
