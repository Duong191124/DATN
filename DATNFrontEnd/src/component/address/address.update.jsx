// src/components/SelectAddressModal.jsx
import React from 'react';
import { Modal, Row, Col, Space, Radio, Button, Typography, Card, Divider } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const { Text } = Typography;

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

const SelectAddressModal = ({
  isModalOpen,
  addresses,
  onAddNewAddress,
  onSelectAddress,
  onEditAddress,
  onDeleteAddress,
  onCancel
}) => {
  return (
    <Modal
      title={
        <Row justify="space-between" align="middle">
          <Text strong>Select Shipping Address</Text>
        </Row>
      }
      open={isModalOpen}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <StyledDivider />
      <Space direction="vertical" style={{ width: '100%' }}>
        {addresses && addresses.map((address) => (
          <ModalAddressCard
            key={address.id}
            className={address.selected ? 'selected' : ''}
            onClick={() => onSelectAddress(address)}
          >
            <Row justify="space-between" align="top">
              <Col flex="1">
                <Radio
                  checked={address.selected}
                  style={{
                    borderColor: address.selected ? '#1890ff' : '', // Blue border when selected
                    color: address.selected ? '#1890ff' : ''   // Blue text color when selected
                  }}
                >
                  <Space direction="vertical" size={8}>
                    <Space>
                      <Text strong>{address.name}</Text>
                      <Text type="secondary">|</Text>
                      <Text>{address.phoneNumber}</Text>
                      {address.isDefault && (
                        <Text type="success" style={{ marginLeft: 8 }}>
                          Default
                        </Text>
                      )}
                    </Space>
                    <Space align="start">
                      <HomeOutlined style={{ marginTop: 4 }} />
                      <Text>{address.addressDetail}, {address.district}, {address.ward}, {address.city}</Text>
                    </Space>
                  </Space>
                </Radio>
              </Col>
              <Col>
                <Space>
                  <ActionButton
                    type="text"
                    icon={<EditOutlined />}
                    onClick={(e) => { e.stopPropagation(); onEditAddress(address); }} // Prevent modal from closing
                  />
                  <ActionButton
                    type="text"
                    className="delete-btn"
                    icon={<DeleteOutlined />}
                    onClick={(e) => { e.stopPropagation(); onDeleteAddress(address); }} // Prevent modal from closing
                  />
                </Space>
              </Col>
            </Row>
          </ModalAddressCard>
        ))}
      </Space>
    </Modal>
  );
};

export default SelectAddressModal;
