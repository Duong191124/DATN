import { ShoppingCartOutlined, UserOutlined, GlobalOutlined } from "@ant-design/icons";
import { Badge, Button, Dropdown, Input, Menu, message, Select } from "antd";
import "./header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CartDrawer from "../../../cart/cart.drawer";
import { useEffect, useState } from "react";
import { useCart } from "../../../context/cart.context";

const items = [
  { key: "1", label: <NavLink to={"/"}>Bóng chuyền</NavLink> },
  { key: "2", label: <NavLink to={"/"}>Bóng đá</NavLink> },
  { key: "3", label: <NavLink to={"/"}>Chạy ban</NavLink> },
];

// const users = [
//   { key: "1", label: <NavLink to={"/login"}>Đăng nhập</NavLink> },
//   { key: "2", label: <NavLink to={"/register"}>Đăng ký</NavLink> },
//   { key: "2", label: <NavLink to={"/info"}>Thông tin</NavLink> },
// ];

const Header = () => {
  const [openCart, setOpenCart] = useState(false);
  const [language, setLanguage] = useState("vi"); // Ngôn ngữ mặc định là tiếng Việt
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const navigate = useNavigate();
  const { setCartItems } = useCart();

  useEffect(() => {
    const loggedIn = !!localStorage.getItem("access_token");
    setIsLoggedIn(loggedIn);
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
      message.success("Đăng xuất thành công");
      navigate("/");
    } catch (error) {
      message.error("Đăng xuất thất bại");
      console.error(error);
    }
  };

  const handleLanguageChange = (value) => {
    setLanguage(value);
  };

  const userMenu = (
    <Menu>
      {isLoggedIn ? (
        <Menu.Item key="logout" onClick={handleLogout}>
          <span>Logout</span>
        </Menu.Item>
      ) : (
        <>
          <Menu.Item key="login">
            <NavLink to="/login">Đăng nhập</NavLink>
          </Menu.Item>
          <Menu.Item key="register">
            <NavLink to="/register">Đăng ký</NavLink>
          </Menu.Item>
        </>
      )}
      {isLoggedIn && (
        <Menu.Item key="info">
          <NavLink to="/info">Thông tin</NavLink>
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
                <li><NavLink to={"/"}>TRANG CHỦ</NavLink></li>
                <li>
                  <Dropdown menu={{ items }} placement="bottom">
                    <a>DANH MỤC</a>
                  </Dropdown>
                </li>
                <li><NavLink to={"/product"}>SẢN PHẨM</NavLink></li>
                <li><a>THÔNG TIN</a></li>
                <li><a>KHÁC</a></li>
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
                defaultValue="vi"
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
