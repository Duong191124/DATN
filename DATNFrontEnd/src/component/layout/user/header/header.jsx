import { ShoppingCartOutlined, UserOutlined, GlobalOutlined } from "@ant-design/icons";
import { Badge, Button, Dropdown, Input, Menu, message, Select } from "antd";
import "./header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CartDrawer from "../../../cart/cart.drawer";
import { useEffect, useState } from "react";
import { useCart } from "../../../context/cart.context";
import { useTranslation } from "react-i18next";
import { useCheckout } from "../../../context/checkout.context";

const Header = () => {
  const { t, i18n } = useTranslation();
  const [openCart, setOpenCart] = useState(false);
  const { resetCheckoutContext } = useCheckout();
  const [language, setLanguage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { setCartItems } = useCart();

  const items = [
    { key: "1", label: <NavLink to={"/"}>{t("MES-003")}</NavLink> },
    { key: "2", label: <NavLink to={"/"}>{t("MES-004")}</NavLink> },
    { key: "3", label: <NavLink to={"/"}>{t("MES-005")}</NavLink> },
  ];

  useEffect(() => {
    const loggedIn = !!localStorage.getItem("access_token");
    setIsLoggedIn(loggedIn);
    const savedLanguage = localStorage.getItem('i18nextLng'); // Kiểm tra ngôn ngữ đã lưu trong localStorage
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage); // Thay đổi ngôn ngữ theo giá trị đã lưu
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId")
      localStorage.removeItem("loginStatus");
      const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
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
        <Menu.Item key="info">
          <NavLink to="/info">{t("MES-012")}</NavLink>
        </Menu.Item>
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
                <li><NavLink to={"/"}>{t("MES-001")}</NavLink></li>
                <li>
                  <Dropdown menu={{ items }} placement="bottom">
                    <a>{t("MES-002")}</a>
                  </Dropdown>
                </li>
                <li><NavLink to={"/product"}>{t("MES-006")}</NavLink></li>
                <li><a>{t("MES-007")}</a></li>
                <li><a>{t("MES-008")}</a></li>
              </ul>
            </div>
          </div>
          <div className="input-search">
            <Input.Search placeholder="Tìm kiếm sản phẩm" />
            <div className="icon-right">
              <Badge onClick={() => setOpenCart(true)} count={99}>
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
