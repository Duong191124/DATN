import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import { AuthWrapper } from "./component/context/auth.context.jsx";
import AppAdmin from "./AppAdmin.jsx";
import Home from "./component/layout/content/home/home.jsx";
import ProductPage from "./pages/product.jsx";
import OrderPage from "./pages/order.jsx";
import CounterSales from "./pages/counter_sales.jsx";
import ProductDetail from "./pages/product.detail.jsx";
import ColorPage from "./pages/color.jsx";
import SizePage from "./pages/size.jsx";
import CollarPage from "./pages/collar.jsx";
import BrandPage from "./pages/brand.jsx";
import CategoryPage from "./pages/category.jsx";
import SleevePage from "./pages/sleeve.jsx";
import PromotionPage from "./pages/promotion.jsx";
import VoucherPage from "./pages/voucher.jsx";
import StaffManagement from "./pages/staff.jsx";
import PrivateRoute from "./pages/private.route.jsx";
import App from "./App.jsx";
import PermissionPage from "./pages/permission.jsx";
import CustomerPage from "./pages/customer.jsx";
const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <AppAdmin />
      </PrivateRoute>
      // <AppAdmin />
    ),
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
        path: "products/:productId",
        element: <ProductDetail />,
      },
      {
        path: "staff",
        element: <StaffManagement />,
      },
      {
        path: "counter-sales",
        element: <CounterSales />,
      },
      {
        path: "order",
        element: <OrderPage />,
      },
      {
        path: "colors",
        element: <ColorPage />,
      },
      {
        path: "sizes",
        element: <SizePage />,
      },
      {
        path: "collars",
        element: <CollarPage />,
      },
      {
        path: "brands",
        element: <BrandPage />,
      },
      {
        path: "categories",
        element: <CategoryPage />,
      },
      {
        path: "sleeves",
        element: <SleevePage />,
      },
      {
        path: "permission",
        element: <PermissionPage />,
      },
      {
        path: "promotions",
        element: <PromotionPage />,
      },
      {
        path: "voucher",
        element: <VoucherPage />,
      },
      {
        path: "customer",
        element: <CustomerPage />,
      },

    ],
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);
createRoot(document.getElementById("root")).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
);