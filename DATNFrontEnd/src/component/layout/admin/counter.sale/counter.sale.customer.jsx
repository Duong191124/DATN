import React, { useEffect, useState } from "react";
import {
  notification,
  Input,
  List,
  Modal,
  Form,
  Input as AntInput,
  Button,
  DatePicker,
  Select,
  Row,
  Col,
  message,
} from "antd";
import { CloseOutlined, PlusCircleOutlined } from "@ant-design/icons"; // Import PlusCircleOutlined
import { useDebounce } from "use-debounce";
import {
  createCustomer,
  updateCustomerByOrder,
} from "../../../../service/api.service";
import { Option } from "antd/es/mentions";
import { data } from "framer-motion/client";

const generateRandomPassword = () => {
  const chars = "0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const CounterSaleCustomer = ({
  customerList,
  setCustomerList,
  onCustomerSelect,
  loadCustomerList,
  selectedBill,
  billWaiting,
  setBillWaiting,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [debouncedSearchText] = useDebounce(searchText, 500);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [form] = Form.useForm();

  // Handle search text change
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };
  // Handle customer selection
  const handleCustomerSelect = async (customer) => {
    try {
      setSelectedCustomer(customer);
      onCustomerSelect(customer);
      if (!selectedBill) {
        message.error("Chưa chọn hóa đơn để chọn khác hàng");
        return;
      }

      // Tìm hóa đơn đang chờ
      const bill = billWaiting.find((bill) => bill.code === selectedBill);
      if (!bill) {
        message.error("Không tìm thấy hóa đơn tương ứng");
        return;
      }
      await updateCustomerByOrder(bill.id, customer.id);
      const updatedBills = billWaiting.map((bill) => {
        if (bill.code === selectedBill) {
          return {
            ...bill,
            customerResponse: { ...customer },
          };
        }
        return bill;
      });
      setBillWaiting(updatedBills);
      notification.success({
        message: "Khách hàng",
        description: "Khách hàng đã được chọn",
        duration: 2,
        placement: "bottomLeft",
      });
      setSearchText("");
      onCustomerSelect(null);
      setSelectedCustomer(null);
      return;
    } catch (error) {
      // Thông báo lỗi
      notification.error({
        message: "Khách hàng",
        description: "Lỗi không thể chọn khách hàng",
        duration: 2,
        placement: "bottomLeft",
      });
    }
  };

  useEffect(() => {
    if (selectedCustomer && selectedBill) {
      const bill = billWaiting.find((bill) => bill.code === selectedBill);
      if (bill) {
        setBillWaiting((prevBills) =>
          prevBills.map((billItem) =>
            billItem.code === selectedBill
              ? { ...billItem, customerResponse: { ...selectedCustomer } }
              : billItem
          )
        );
      }
    }
  }, [selectedCustomer, selectedBill]);

  const handleAddCustomer = async (values) => {
    try {
      const username = values.name;
      const password = values.password || generateRandomPassword();
      const newCustomer = await createCustomer(
        username,
        password,
        values.email,
        values.address,
        values.phone,
        values.dob,
        values.name,
        values.note,
        values.gender
      );
      // Cập nhật lại danh sách khách hàng trong component cha
      if (newCustomer.status === 201) {
        setCustomerList((prevCustomerList) => [
          ...prevCustomerList,
          newCustomer,
        ]);
        notification.success({
          message: "Khách hàng đã được thêm thành công",
          description: `Khách hàng ${values.name} đã được thêm.`,
          placement: "top",
        });
        setIsModalVisible(false);
        setIsCreated(true);
        form.resetFields();
      }
    } catch (error) {
      notification.error({
        message: "Lỗi khi thêm khách hàng",
        description: "Đã xảy ra lỗi khi thêm khách hàng. Vui lòng thử lại.",
      });
    }
  };
  useEffect(() => {
    const filtered = customerList?.filter(
      (customer) =>
        (customer?.name?.toLowerCase() ?? "").includes(
          searchText.toLowerCase()
        ) ||
        (customer?.email?.toLowerCase() ?? "").includes(
          searchText.toLowerCase()
        ) ||
        (customer?.phoneNumber?.toLowerCase() ?? "").includes(
          searchText.toLowerCase()
        )
    );
    setFilteredCustomers(filtered);
  }, [searchText, customerList]);
  useEffect(() => {
    if (isCreated) {
      loadCustomerList();
      setIsCreated(false);
    }
  }, [isCreated]);
  return (
    <div style={{ marginTop: 20, position: "relative" }} id="customer">
      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Input
          placeholder="Tìm kiếm theo tên, email hoặc số điện thoại khách hàng"
          value={searchText}
          onChange={handleSearch}
          style={{
            flex: 1,
            borderRadius: "30px",
            padding: "10px 20px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
          allowClear
        />

        <Button
          type="primary"
          onClick={() => setIsModalVisible(true)}
          shape="circle"
          style={{
            marginLeft: "10px",
            height: "40px", // Đảm bảo nút có kích thước phù hợp với input
            width: "40px",
            padding: "0", // Xóa padding để nút có kích thước chính xác
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          icon={<PlusCircleOutlined style={{ fontSize: "20px" }} />}
        />
      </div>
      <Modal
        title="Thêm Khách Hàng"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800} // Đặt chiều rộng rộng hơn
        style={{
          borderRadius: "10px",
          padding: "20px",
        }}
      >
        <Form form={form} onFinish={handleAddCustomer} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên khách hàng!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: "email", message: "Email không hợp lệ!" },
                  { required: true, message: "Vui lòng nhập email!" },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="Địa chỉ" name="address">
                <Input />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^(0[3-9][0-9]{8})$/,
                    message: "Số điện thoại không hợp lệ.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ngày sinh"
                name="dob"
                rules={[
                  { required: true, message: "Vui lòng chọn ngày sinh!" },
                ]}
              >
                <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item label="Ghi chú" name="note">
                <Input.TextArea />
              </Form.Item>

              <Form.Item
                label="Giới tính"
                name="gender"
                rules={[
                  { required: true, message: "Vui lòng chọn giới tính!" },
                ]}
              >
                <Select placeholder="Chọn giới tính">
                  <Option value="1">Nam</Option>
                  <Option value="2">Nữ</Option>
                  <Option value="3">Khác</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Thêm Khách Hàng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {debouncedSearchText && (
        <div
          style={{
            marginTop: 10,
            maxHeight: "250px",
            overflowY: "auto",
            zIndex: 10,
            position: "absolute",
            width: "100%",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
          }}
        >
          <List
            itemLayout="horizontal"
            dataSource={filteredCustomers}
            renderItem={(customer) => (
              <List.Item
                style={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedCustomer?.id === customer.id ? "#e6f7ff" : "white",
                  borderBottom: "1px solid #f0f0f0",
                  borderRadius: "5px",
                }}
                onClick={() => handleCustomerSelect(customer)}
              >
                <List.Item.Meta
                  title={customer.name}
                  description={`Mã khách hàng: ${customer.id} | SĐT: ${customer.phoneNumber}`}
                />
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default CounterSaleCustomer;
