import { useState } from "react";
import {
  TeamOutlined,
  ProductOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, Menu } from "antd";
import { Link } from "react-router-dom";

const items = [
  {
    key: "1",
    icon: <TeamOutlined />,
    label: <Link to="/admin/counter-sales">Counter-Sales Management</Link>,
  },
  {
    key: "2",
    icon: <TeamOutlined />,
    label: <Link to="/admin/order">Bill Management</Link>,
  },
  {
    key: "opt1",
    icon: <ProductOutlined />,
    label: "Product",
    children: [
      {
        key: "3",
        icon: <ProductOutlined />,
        label: <Link to="/admin/products">Product Management</Link>,
      },
      {
        key: "4",
        icon: <TeamOutlined />,
        label: <Link to="/admin/colors">Color Management</Link>,
      },
      {
        key: "5",
        icon: <TeamOutlined />,
        label: <Link to="/admin/sizes">Size Management</Link>,
      },
      {
        key: "6",
        icon: <TeamOutlined />,
        label: <Link to="/admin/collars">Collar Management</Link>,
      },
      {
        key: "7",
        icon: <TeamOutlined />,
        label: <Link to="/admin/brands">Brand Management</Link>,
      },
      {
        key: "8",
        icon: <TeamOutlined />,
        label: <Link to="/admin/categories">Category Management</Link>,
      },
      {
        key: "9",
        icon: <SettingOutlined />,
        label: <Link to="/admin/sleeves">Sleeve Management</Link>,
      },
    ],
  },
  {
    key: "10",
    icon: <TeamOutlined />,
    label: <Link to="/admin/staff">Staff Management</Link>,
  },
  {
    key: "11",
    icon: <SettingOutlined />,
    label: <Link to="/admin/permission">Permission Management</Link>,
  },
  {
    key: "12",
    icon: <SettingOutlined />,
    label: <Link to="/admin/voucher">Voucher Management</Link>,
  },
  {
    key: "13",
    icon: <SettingOutlined />,
    label: <Link to="/admin/promotions">Promotion Management</Link>,
  },
  {
    key: "14",
    icon: <SettingOutlined />,
    label: <Link to="/admin/customer">Customer Management</Link>,
  },
  {
    key: "14",
    icon: <SettingOutlined />,
    label: <Link to="/admin/ecommer"> Management</Link>,
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
const NavbarAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
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

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  return (
    <>
      {/* <Button
        onClick={toggleCollapsed}
        style={{
          margin: '16px',
          backgroundColor: '#1890ff',
          color: 'white',
        }}
      >
        {collapsed ? 'Expand Menu' : 'Collapse Menu'}
      </Button> */}
      <Menu
        mode="inline"
        defaultSelectedKeys={["123"]}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChange}
        style={{
          width: 256,
        }}
        inlineCollapsed={collapsed}
        className="menu-sidebar"
        items={items}
      />
    </>
  );
};
export default NavbarAdmin;
