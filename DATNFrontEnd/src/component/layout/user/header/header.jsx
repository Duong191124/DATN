import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Button, Dropdown, Input, Menu } from "antd";
import "./header.css";
import { Link, NavLink } from "react-router-dom";
import CartDrawer from "../../../cart/cart.drawer";
import { useState } from "react";
const items = [
  {
    key: "1",
    label: <NavLink to={"/"}>Bóng chuyền</NavLink>,
  },
  {
    key: "2",
    label: <NavLink to={"/"}>Bóng đá</NavLink>,
  },
  {
    key: "3",
    label: <NavLink to={"/"}>Chạy ban</NavLink>,
  },
];
const users = [
  {
    key: "1",
    label: <NavLink to={"/login"}>Đăng nhập</NavLink>,
  },
  {
    key: "2",
    label: <NavLink to={"/register"}>Đăng ký</NavLink>,
  },
];
const Header = () => {

  const [openCart, setOpenCart] = useState(false);
  const userMenu = (
    <Menu>
      {users.map((user) => (
        <Menu.Item key={user.key}>{user.label}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <>
      <div className="header">
        <div className="header-container">
          <div className="logo-menu">
            <div className="logo">
              <Link to="/">
                <img src="/image/logo.jpg" className="logo-image" />
              </Link>
            </div>
            <div className="menu">
              <ul>
                <li>
                  <NavLink to={"/"}>TRANG CHỦ</NavLink>
                </li>
                <li>
                  <Dropdown
                    menu={{
                      items,
                    }}
                    placement="bottom"
                  >
                    <a>DANH MỤC</a>
                  </Dropdown>
                </li>
                <li>
                  <NavLink to={"/home-page"}>SẢN PHẨM</NavLink>
                </li>
                <li>
                  <a>THÔNG TIN</a>
                </li>
                <li>
                  <a>KHÁC</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="input-search">
            <Input.Search placeholder="Tìm kiếm sản phẩm" />
            <div className="icon-right">
              <Badge
                onClick={() => {
                  setOpenCart(true);
                }}
                count={99}>
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
            </div>
          </div>
        </div>
      </div>
      <CartDrawer
        openCart={openCart}
        setOpenCart={setOpenCart}
      />
    </>
  );
};

export default Header;
