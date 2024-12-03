import { useState } from "react";
import {
  TeamOutlined,
  ProductOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { Link } from "react-router-dom";

const items = [
  {
    key: "1",
    icon: <TeamOutlined />,
    label: <Link to="/admin/chart">Thống kê</Link>,
  },
  {
    key: "2",
    icon: <TeamOutlined />,
    label: <Link to="/admin/order">Quản lý hóa đơn</Link>,
  },
  {
    key: "opt1",
    icon: <ProductOutlined />,
    label: "Quản lý sản phẩm",
    children: [
      {
        key: "3",
        icon: <ProductOutlined />,
        label: <Link to="/admin/products">Sản phẩm</Link>,
      },
      {
        key: "4",
        icon: <TeamOutlined />,
        label: <Link to="/admin/colors">Quản lý màu sắc</Link>,
      },
      {
        key: "5",
        icon: <TeamOutlined />,
        label: <Link to="/admin/sizes">Quản lý kích thước</Link>,
      },
      {
        key: "6",
        icon: <TeamOutlined />,
        label: <Link to="/admin/collars">Quản lý cổ áo</Link>,
      },
      {
        key: "7",
        icon: <TeamOutlined />,
        label: <Link to="/admin/brands">Quản lý thương hiệu</Link>,
      },
      {
        key: "8",
        icon: <TeamOutlined />,
        label: <Link to="/admin/categories">Quản lý danh mục</Link>,
      },
      {
        key: "9",
        icon: <SettingOutlined />,
        label: <Link to="/admin/sleeves">Quản lý tay áo</Link>,
      },
    ],
  },
  {
    key: "11",
    icon: <TeamOutlined />,
    label: <Link to="/admin/staff">Quản lý nhân viên</Link>,
  },
  {
    key: "12",
    icon: <SettingOutlined />,
    label: <Link to="/admin/permission">Quản lý quyền</Link>,
  },
  {
    key: "13",
    icon: <SettingOutlined />,
    label: <Link to="/admin/voucher">Quản lý phiếu giảm giá</Link>,
  },
  {
    key: "14",
    icon: <SettingOutlined />,
    label: <Link to="/admin/promotions">Quản lý khuyến mãi</Link>,
  },
  {
    key: "15",
    icon: <SettingOutlined />,
    label: <Link to="/admin/customer">Quản lý khách hàng</Link>,
  },
];
const getLevelKeys = (items1) => {
  const key = {};
  const func = (items2, level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};
const levelKeys = getLevelKeys(items);
const NavbarAdmin = ({ collapsed }) => {
  const [stateOpenKeys, setStateOpenKeys] = useState(["2", "23"]);

  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(
      (key) => stateOpenKeys.indexOf(key) === -1
    );
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey])
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  return (
    <>
      <Menu
        mode="inline"
        defaultSelectedKeys={["123"]}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        inlineCollapsed={collapsed}
        className="menu-sidebar"
        items={items}
      />
    </>
  );
};
export default NavbarAdmin;
