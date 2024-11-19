import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Modal, 
  Radio, 
  Space, 
  Typography, 
  Row, 
  Col,
  Form,
  Input,
  Select,
  Divider
} from 'antd';
import { 
  HomeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  SwapOutlined 
} from '@ant-design/icons';
import styled from 'styled-components';
import ShippingCostPanel from './checkout.cost';

const { Title, Text } = Typography;
const { Option } = Select;

const AddressCard = styled(Card)`
  border-radius: 2px;
  margin-bottom: 24px;
  background: white;
  border: 1px solid #d9d9d9;
  
  .ant-card-body {
    padding: 24px;
  }
`;

const ModalAddressCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #d9d9d9;
  
  &:hover {
    border-color: #000;
  }

  &.selected {
    border: 2px solid #000;
    background: #fafafa;
  }

  .ant-card-body {
    padding: 16px;
  }
`;

const BlackButton = styled(Button)`
  &.ant-btn-primary {
    background: #000;
    border-color: #000;
    
    &:hover, &:focus {
      background: #333;
      border-color: #333;
    }
  }
`;

const ActionButton = styled(Button)`
  &.ant-btn-text {
    color: #000;
    
    &:hover {
      background: rgba(0, 0, 0, 0.06);
    }
    
    &.delete-btn {
      color: #ff4d4f;
      
      &:hover {
        background: #fff1f0;
      }
    }
  }
`;

const StyledDivider = styled(Divider)`
  margin: 12px 0;
  border-color: #d9d9d9;
`;

const Shipping = () => {
  // Fake address data
  const addresses = [
    {
      id: 1,
      name: 'John Doe',
      phone: '0123456789',
      email: 'john.doe@email.com',
      address: '123 Main Street',
      district: 'District 1',
      ward: 'Ward 1',
      city: 'Ho Chi Minh City',
      isDefault: true,
    },
    {
      id: 2,
      name: 'John Doe',
      phone: '0987654321',
      email: 'john.doe2@email.com',
      address: '456 Park Avenue',
      district: 'District 2',
      ward: 'Ward 2',
      city: 'Ho Chi Minh City',
      isDefault: false,
    },
  ];

  // Fake shipping cost data
  const shippingCosts = {
    subtotal: 250000,
    shippingFee: 30000,
    discount: -20000,
    total: 260000
  };

  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    addresses.find(addr => addr.isDefault)
  );

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsModalOpen(false);
  };

  const handleEdit = (e, address) => {
    e.stopPropagation();
    console.log('Edit address:', address);
  };

  const handleDelete = (e, address) => {
    e.stopPropagation();
    console.log('Delete address:', address);
  };

  const handleAddNew = () => {
    console.log('Add new address');
  };

  return (
    <>
      <AddressCard>
        <Space direction="vertical" style={{ width: '100%' }} size={16}>
          <Row justify="space-between" align="middle">
            <Title level={4} style={{ margin: 0 }}>Shipping Address</Title>
            <BlackButton 
              type="primary" 
              icon={<SwapOutlined />}
              onClick={() => setIsModalOpen(true)}
            >
              Change Address
            </BlackButton>
          </Row>
          
          <Space direction="vertical" size={8}>
            <Space>
              <Text strong>{selectedAddress.name}</Text>
              <Text type="secondary">|</Text>
              <Text>{selectedAddress.phone}</Text>
            </Space>
            <Space align="start">
              <HomeOutlined style={{ marginTop: 4 }}/>
              <Text>
                {selectedAddress.address}, {selectedAddress.district}, {selectedAddress.ward}, {selectedAddress.city}
              </Text>
            </Space>
          </Space>
        </Space>
      </AddressCard>

      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: '100%' }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Recipient Name"
              rules={[{ required: true, message: 'Please enter recipient name' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="address"
          label="Detailed Address"
          rules={[{ required: true, message: 'Please enter detailed address' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please select city' }]}
            >
              <Select>
                <Option value="Ho Chi Minh City">Ho Chi Minh City</Option>
                <Option value="Hanoi">Hanoi</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="district"
              label="District"
              rules={[{ required: true, message: 'Please select district' }]}
            >
              <Select>
                <Option value="District 1">District 1</Option>
                <Option value="District 2">District 2</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="ward"
              label="Ward"
              rules={[{ required: true, message: 'Please select ward' }]}
            >
              <Select>
                <Option value="Ward 1">Ward 1</Option>
                <Option value="Ward 2">Ward 2</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <ShippingCostPanel costs={shippingCosts} />

      <Modal
        title={
          <Row justify="space-between" align="middle">
            <Text strong>Select Shipping Address</Text>
            <BlackButton 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleAddNew}
            >
              Add New Address
            </BlackButton>
          </Row>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
      >
        <StyledDivider />
        <Space direction="vertical" style={{ width: '100%' }}>
          {addresses.map((address) => (
            <ModalAddressCard
              key={address.id}
              className={selectedAddress.id === address.id ? 'selected' : ''}
              onClick={() => handleAddressSelect(address)}
            >
              <Row justify="space-between" align="top">
                <Col flex="1">
                  <Radio checked={selectedAddress.id === address.id}>
                    <Space direction="vertical" size={8}>
                      <Space>
                        <Text strong>{address.name}</Text>
                        <Text type="secondary">|</Text>
                        <Text>{address.phone}</Text>
                        {address.isDefault && (
                          <Text type="success" style={{ marginLeft: 8 }}>
                            Default
                          </Text>
                        )}
                      </Space>
                      <Space align="start">
                        <HomeOutlined style={{ marginTop: 4 }}/>
                        <Text>
                          {address.address}, {address.district}, {address.ward}, {address.city}
                        </Text>
                      </Space>
                    </Space>
                  </Radio>
                </Col>
                <Col>
                  <Space>
                    <ActionButton
                      type="text"
                      icon={<EditOutlined />}
                      onClick={(e) => handleEdit(e, address)}
                    />
                    <ActionButton
                      type="text"
                      className="delete-btn"
                      icon={<DeleteOutlined />}
                      onClick={(e) => handleDelete(e, address)}
                    />
                  </Space>
                </Col>
              </Row>
            </ModalAddressCard>
          ))}
        </Space>
      </Modal>
    </>
  );
};

export default Shipping;