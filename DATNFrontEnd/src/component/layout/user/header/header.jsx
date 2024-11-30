import {
  ShoppingCartOutlined,
  UserOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Badge, Button, Dropdown, Input, Menu, message, Select } from "antd";
import "./header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CartDrawer from "../../../cart/cart.drawer";
import { useEffect, useState } from "react";
import { useCart } from "../../../context/cart.context";
import { useTranslation } from "react-i18next";
import { useCheckout } from "../../../context/checkout.context";
import {
  fetchDataCategoryAPI,
  fetchDataProduct,
  fetchProductsByProductDetails,
} from "../../../../service/api.service";
import ProductSearch from "./search.filter";

const categoryStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "space-between",
  height: "100%",
  flex: "1",
};

const categoryTitleStyle = {
  fontWeight: "bold",
  fontSize: "20px",
  marginBottom: "10px",
};

const productItemStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "5px",
  padding: "5px 0",
  cursor: "pointer",
};
const productImageDiv = {
  width: "55px",
  height: "55px",
  marginRight: "15px",
};
const productImageStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "50%",
  border: "1px solid #ddd",
  objectFit: "cover",
};

const productLinkStyle = {
  textDecoration: "none",
  color: "#000",
  fontSize: "18px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "128px",
};

const Header = () => {
  const { t, i18n } = useTranslation();
  const [openCart, setOpenCart] = useState(false);
  const { resetCheckoutContext } = useCheckout();
  const [language, setLanguage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const navigate = useNavigate();
  const { cartItems, setCartItems } = useCart();

  const items = category.map((cat) => {
    const categoryProducts = product.filter(
      (prod) => prod.category.id === cat.id
    );
    const productsToShow = categoryProducts.slice(0, 3);
    return {
      key: cat.id,
      label: (
        <div style={categoryStyle}>
          <div style={categoryTitleStyle}>{cat.name}</div>
          <div>
            {productsToShow.map((prod) => (
              <NavLink to={`/product/${prod.id}`} key={prod.id}>
                <div
                  style={productItemStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#ddd";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "";
                  }}
                >
                  <div style={productImageDiv}>
                    <img
                      src={prod.image || "https://via.placeholder.com/150"}
                      alt={prod.name}
                      style={productImageStyle}
                    />
                  </div>
                  <div style={productLinkStyle}>{prod.name}</div>
                </div>
              </NavLink>
            ))}
          </div>
          {categoryProducts.length > 3 && (
            <Button
              style={{
                width: "100%",
                color: "#000",
                borderTop: "1px solid #ddd",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ddd";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "";
              }}
              type="link"
              onClick={() => navigate(`/product?category=${cat.name}`)}
            >
              Xem thêm
            </Button>
          )}
        </div>
      ),
    };
  });

  const menu = (
    <Menu
      items={items}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: "10px",
        marginTop: "20px",
        alignItems: "start",
        width: "1200px",
      }}
    />
  );

  const getAllCategory = async () => {
    const response = await fetchDataCategoryAPI();
    if (response?.data?.data) {
      setCategory(response.data.data);
    }
  };

  const getAllProduct = async () => {
    const response = await fetchDataProduct();
    if (response?.data?.data) {
      setProduct(response.data.data);
    }
  };
  const filterProduct = async () => {
    const response = await fetchProductsByProductDetails(0, 1000);
    console.log("response", response);
    if (response?.data?.data) {
      setDataProduct(response?.data?.data.products);
    }
  };
  useEffect(() => {
    getAllCategory();
    getAllProduct();
    filterProduct();
  }, []);

  useEffect(() => {
    const loggedIn = !!localStorage.getItem("access_token");
    setIsLoggedIn(loggedIn);
    const savedLanguage = localStorage.getItem("i18nextLng"); // Kiểm tra ngôn ngữ đã lưu trong localStorage
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage); // Thay đổi ngôn ngữ theo giá trị đã lưu
    }
  }, []);

  const handleLogout = () => {
    try {
      const userId = 1;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.setItem("userId", userId);
      localStorage.removeItem("loginStatus");
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCartItems(guestCart);
      setIsLoggedIn(false);
      resetCheckoutContext();
      message.success(t("MES-022"));
      navigate("/");
    } catch (error) {
      message.error(t("MES-023"));
      console.error(error);
    }
  };
  const handleLanguageChange = (value) => {
    setLanguage(value);
    i18n.changeLanguage(value); // Thay đổi ngôn ngữ cho toàn bộ ứng dụng
  };
  const userMenu = (
    <Menu>
      {isLoggedIn ? (
        <Menu.Item key="logout" onClick={handleLogout}>
          <span>{t("MES-011")}</span>
        </Menu.Item>
      ) : (
        <>
          <Menu.Item key="login">
            <NavLink to="/login">{t("MES-009")}</NavLink>
          </Menu.Item>
          <Menu.Item key="register">
            <NavLink to="/register">{t("MES-010")}</NavLink>
          </Menu.Item>
        </>
      )}
      {isLoggedIn && (
        <>
          <Menu.Item key="info">
            <NavLink to="/info">{t("MES-012")}</NavLink>
          </Menu.Item>
          <Menu.Item key="info-order">
            <NavLink to="/info-order">{t("MES-008")}</NavLink>
          </Menu.Item>
        </>
      )}
    </Menu>
  );
  return (
    <>
      <div className="header">
        <div className="header-container">
          <div className="logo-menu">
            <div className="logo">
              <Link to="/">
                <img src="/image/logo.jpg" className="logo-image" alt="logo" />
              </Link>
            </div>
            <div className="menu">
              <ul>
                <li>
                  <NavLink to={"/"}>{t("MES-001")}</NavLink>
                </li>
                <li>
                  <Dropdown
                    overlay={menu}
                    overlayStyle={{
                      left: "128px",
                    }}
                  >
                    <a>{t("MES-002")}</a>
                  </Dropdown>
                </li>
                <li>
                  <NavLink to={"/product"}>{t("MES-006")}</NavLink>
                </li>
                <li>
                  <NavLink to={"/tracking"}>{t("MES-007")}</NavLink>
                </li>
                <li>
                  <NavLink to={"/about-us"}>{t("MES-046")}</NavLink>
                </li>
                <li>
                  <NavLink to={"/contact"}>{t("MES-047")}</NavLink>
                </li>
              </ul>
            </div>
          </div>
          <div className="input-search">
            <ProductSearch data={dataProduct} />
            <div className="icon-right">
              <Badge onClick={() => setOpenCart(true)} count={cartItems.length} showZero>
                <Button
                  type="text"
                  className="icon-right-btn"
                  icon={<ShoppingCartOutlined style={{ fontSize: "32px" }} />}
                />
              </Badge>
              <Dropdown overlay={userMenu} placement="bottomLeft">
                <Button
                  type="text"
                  className="icon-right-btn"
                  icon={<UserOutlined style={{ fontSize: "32px" }} />}
                />
              </Dropdown>
              {/* Tùy chọn ngôn ngữ */}
              <Select
                value={language}
                style={{ width: 100, marginLeft: 16 }}
                onChange={handleLanguageChange}
                suffixIcon={<GlobalOutlined />}
              >
                <Select.Option value="vi">Tiếng Việt</Select.Option>
                <Select.Option value="en">English</Select.Option>
                {/* Thêm các ngôn ngữ khác nếu cần */}
              </Select>
            </div>
          </div>
        </div>
      </div>
      <CartDrawer openCart={openCart} setOpenCart={setOpenCart} />
    </>
  );
};

export default Header;
