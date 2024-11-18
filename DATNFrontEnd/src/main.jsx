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
import App from "./App.jsx";
import PermissionPage from "./pages/permission.jsx";
import CustomerPage from "./pages/customer.jsx";
import CheckoutPage from "./pages/checkout.jsx";
import Header from "./component/layout/user/header/header.jsx";
// import ProductDetailPage from "./component/layout/content/home/index/product.detail.page.jsx";
import ProductDetailPage from "./component/layout/content/san-pham/product.detail.page.jsx"
import RequestForgotPassword from "./pages/request.forgot.password.jsx";
import ResetPassword from "./pages/reset.password.jsx";
import WeightPage from "./pages/weight.jsx";
import "./i18n.jsx";
import InfoPage from "./pages/info.jsx";
import { CartProvider } from "./component/context/cart.context.jsx";
import SanPham from "./component/layout/content/san-pham/san-pham.jsx";
import ContactPage from "./pages/contact.jsx";
import LandingPage from "./pages/landing.jsx";
import { CheckoutProvider } from "./component/context/checkout.context.jsx";
import TrackingPage from "./pages/tracking.jsx";

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      // <PrivateRoute>
      <AppAdmin />
      // </PrivateRoute>
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
      {
        path: "weight",
        element: <WeightPage />,
      },
    ],
  },
  {
    path: "/counter-sales",
    element: <CounterSales />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/product",
        element: <SanPham />
      },
      {
        path: "/product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "/info",
        element: <InfoPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />
      },
      {
        path: "/about-us",
        element: <LandingPage />
      },
      {
        path: "/tracking",
        element: <TrackingPage />,
      },
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
  {
    path: "/forgot-password",
    element: <RequestForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/checkout",
    element: (
      <>
        <Header />
        <CheckoutPage />
      </>
    ),
  },
]);
createRoot(document.getElementById("root")).render(
  <AuthWrapper>
    <CartProvider>
      <CheckoutProvider>
        <RouterProvider router={router} />
      </CheckoutProvider>
    </CartProvider>
  </AuthWrapper>
);
