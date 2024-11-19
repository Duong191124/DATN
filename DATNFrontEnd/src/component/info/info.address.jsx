// InfoAddress.js

import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal, Row, Tooltip, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EnvironmentOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import AddressModal from '../address/address.select';
import { deleteAddressByid, getAddressByCustomerId } from '../../service/api.service';

// Styled Components
const AddressContainer = styled.div`
  padding: 24px;
  background: #ffffff;
  min-height: 100%;
  border-radius: 10px;
`;

const ScrollContainer = styled.div`
  margin-top: 16px;
  max-height: 250px;
  overflow-y: auto;
  padding-right: 16px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
`;

const StyledCard = styled(Card)`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

const AddressTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 0;
  color: #1a1a1a;
`;

const AddressInfo = styled.div`
  margin: 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4a4a4a;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const InfoAddress = ({ user }) => {
    const { t } = useTranslation();
    const [addresses, setAddresses] = useState([]);

    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const getAddressByid = async () => {
        const res = await getAddressByCustomerId(user.data.id)
        setAddresses(res.data.data);
    }

    useEffect(() => {
        getAddressByid();
    }, [])

    const showModal = (address = null) => {
        setEditingAddress(address);
        if (address) {
            form.setFieldsValue(address);
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
        setEditingAddress(null);
    };

    const handleSubmit = async (values) => {
        if (editingAddress) {
            setAddresses(addresses.map(addr =>
                addr.id === editingAddress.id ? { ...values, id: addr.id } : addr
            ));
            message.success(t('Address updated successfully'));
        } else {
            const newId = addresses.length + 1;
            setAddresses([...addresses, { ...values, id: newId }]);
            message.success(t('Address added successfully'));
        }
        setIsModalVisible(false);
        form.resetFields();
    };

    const deleteAddress = (id) => {
        Modal.confirm({
            title: t('Are you sure you want to delete this address?'),
            content: t('This action cannot be undone.'),
            okText: t('Yes'),
            cancelText: t('No'),
            okButtonProps: {
                danger: true
            },
            onOk: async () => {
                try {
                    await deleteAddressByid(id);
                    getAddressByid();
                    message.success(t('Address deleted successfully'));
                } catch (error) {
                    message.error(t('Failed to delete address'));
                }
            }
        });
    };


    return (
        <AddressContainer>
            <Row align="middle" justify="space-between" style={{ marginBottom: 24 }}>
                <Col>
                    <AddressTitle>{t('My Addresses')}</AddressTitle>
                </Col>
                <Col>
                    <Tooltip title={addresses.length >= 3 ? t('You can only add up to 3 addresses') : ''}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showModal()}
                            size="large"
                            disabled={addresses.length >= 3}
                            style={{
                                background: addresses.length >= 3 ? '#cccccc' : '#1a1a1a',
                                borderRadius: '8px',
                                height: '44px',
                                paddingInline: '24px',
                                cursor: addresses.length >= 3 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {t('Add Address')}
                        </Button>
                    </Tooltip>
                </Col>
            </Row>

            <ScrollContainer>
                <AnimatePresence>
                    {addresses.map(address => (
                        <motion.div
                            key={address.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <StyledCard>
                                <Row justify="space-between" align="middle">
                                    <Col flex="1">
                                        <AddressInfo>
                                            <UserOutlined /> <strong>{address.name}</strong>
                                        </AddressInfo>
                                        <AddressInfo>
                                            <PhoneOutlined /> {address.phoneNumber}
                                        </AddressInfo>
                                        <AddressInfo>
                                            <EnvironmentOutlined /> {address.addressDetail}
                                        </AddressInfo>
                                    </Col>
                                    <Col>
                                        <ButtonGroup>
                                            <Button
                                                icon={<EditOutlined />}
                                                onClick={() => showModal(address)}
                                                style={{
                                                    borderRadius: '6px',
                                                }}
                                            >
                                                {t('Edit')}
                                            </Button>
                                            <Button
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={() => deleteAddress(address.id)}
                                                style={{
                                                    borderRadius: '6px',
                                                }}
                                            >
                                                {t('Delete')}
                                            </Button>
                                        </ButtonGroup>
                                    </Col>
                                </Row>
                            </StyledCard>
                        </motion.div>
                    ))}
                    <div style={{ height: 50 }} ></div>
                </AnimatePresence>
            </ScrollContainer>

            {/* Address Modal Component */}
            <AddressModal
                setIsModalVisible={setIsModalVisible}
                userID={user.data.id}
                isModalVisible={isModalVisible}
                handleCancel={handleCancel}
                handleSubmit={handleSubmit}
                form={form}
                editingAddress={editingAddress}
                getAddressByid={getAddressByid}
            />
        </AddressContainer>
    );
};

export default InfoAddress;
