import React, { useEffect, useState } from 'react';
import { getAddressByCustomerId, getDistrict, getProvinces, getUserInfo, getWards } from '../../service/api.service';
import { useCart } from '../context/cart.context';
import { useCheckout } from '../context/checkout.context';
import { Button, Card, Col, Divider, Form, Input, Modal, Radio, Row, Select, Space, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, HomeOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import ShippingCostPanel from './checkout.cost';
import AddressModal from '../address/address.select';
import { useTranslation } from 'react-i18next';

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
    // State variables for input values
    const { t, i18n } = useTranslation();
    const language = localStorage.getItem("language") || "vi";
    const { cartItems } = useCart()
    const {
        setDistrict,
        setFromDistrict,
        setWard,
        setWeight,
        setServiceId,
        addresses,
        setAddresses,
        resetGhnTotalPrice,
        setProvinces,
        provinces,
        district,
        ward
    } = useCheckout();
    const [form] = Form.useForm();
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasAddress, setHasAddress] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [selectAddress, setSelectAddress] = useState(null);

    const defaultOption = { ProvinceID: '', DistrictID: '', WardCode: '', ProvinceName: t('MES-024'), DistrictName: t('MES-027'), WardName: t('MES-030') };

    useEffect(() => {
        getInformationForCustomer()
    }, []);

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [i18n, language]);

    useEffect(() => {
        const fetchProvinces = async () => {
            const res = await getProvinces();
            setProvinces([defaultOption, ...res.data.data]);
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        if (provinces && provinces !== defaultOption.ProvinceID) {
            const fetchDistricts = async () => {
                const res = await getDistrict(provinces);
                console.log(res);
                setDistrict([defaultOption, ...res.data.data]);
            };
            fetchDistricts();
        } else {
            setDistrict([]);
            setWard([]);
        }
    }, [provinces]);

    useEffect(() => {
        if (district && district !== defaultOption.DistrictID) {
            const fetchWards = async () => {
                const res = await getWards(district);
                setWard([defaultOption, ...res.data.data]);
            };
            fetchWards();
        } else {
            setWard([]);
        }
    }, [district]);

    const getInformationForCustomer = async () => {
        try {
            const res = await getUserInfo();
            const addressData = await getAddressByCustomerId(res.data.data.id);
            if (addressData?.data?.data && addressData.data.data.length > 0) {
                setHasAddress(true);
                // Duyệt qua tất cả địa chỉ
                const defaultAddress = addressData.data.data[0];
                if (defaultAddress) {
                    setFullName(defaultAddress.name);
                    setAddress(defaultAddress.addressDetail);
                    setMobileNumber(defaultAddress.phoneNumber);
                    setDistrict(defaultAddress.district);
                    setFromDistrict(defaultAddress.fromDistrict);
                    setWard(defaultAddress.ward);
                    setServiceId(defaultAddress.serviceId);
                }
                setAddresses(defaultAddress);
            }
            else {
                setHasAddress(false);
            }
            cartItems.forEach(cart => {
                if (cart) {
                    setWeight(cart.weight.weightValue);
                }
            })
        } catch (error) {
            console.error(error);
        }
    };

    const showModal = (addresses) => {
        const normalizedAddresses = Array.isArray(addresses) ? addresses : [addresses];
        normalizedAddresses.forEach(address => {
            setEditingAddress(address);
            if (address) {
                form.setFieldsValue(address); // Pre-fill form with address details
            } else {
                form.resetFields(); // Clear form for new address
            }
        });
        resetGhnTotalPrice();
        setIsModalVisible(true);
    };

    const handleAddNewAddress = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    }

    console.log(district)

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
                            <Text strong>{addresses.name}</Text>
                            <Text type="secondary">|</Text>
                            <Text>{addresses.phone}</Text>
                        </Space>
                        <Space align="start">
                            <HomeOutlined style={{ marginTop: 4 }} />
                            <Text>
                                {address}
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
                            <Select
                                placeholder="Select a city"
                                onChange={(value) => {
                                    setFromDistrict(value); // Cập nhật `ProvinceID`
                                    setDistrict([]);       // Xóa quận khi thay đổi tỉnh/thành phố
                                    setWard([]);           // Xóa phường khi thay đổi tỉnh/thành phố
                                }}
                                allowClear
                            >
                                {Array.isArray(provinces) && provinces.map((province) => (
                                    <Option key={province.ProvinceID} value={province.ProvinceID}>
                                        {province.ProvinceName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="district"
                            label="District"
                            rules={[{ required: true, message: 'Please select district' }]}
                        >
                            <Select
                                placeholder="Select a district"
                                onChange={(value) => {
                                    setDistrict(value); // Cập nhật `DistrictID`
                                    setWard([]);        // Xóa phường khi thay đổi quận/huyện
                                }}
                                allowClear
                            >
                                {Array.isArray(district) && district.map((d) => (
                                    <Option key={d.DistrictID} value={d.DistrictID}>
                                        {d.DistrictName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            name="ward"
                            label="Ward"
                            rules={[{ required: true, message: 'Please select ward' }]}
                        >
                            <Select
                                placeholder="Select a ward"
                                onChange={(value) => setWard(value)} // Cập nhật `WardCode`
                                allowClear
                            >
                                {Array.isArray(ward) && ward.map((w) => (
                                    <Option key={w.WardCode} value={w.WardCode}>
                                        {w.WardName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

            </Form>

            <Modal
                title={
                    <Row justify="space-between" align="middle">
                        <Text strong>Select Shipping Address</Text>
                        <BlackButton
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddNewAddress}
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
                    {addresses && (
                        <ModalAddressCard
                            key={addresses.id}
                            className={'selected'}
                            onClick={() => setSelectAddress(addresses)}
                        >
                            <Row justify="space-between" align="top">
                                <Col flex="1">
                                    <Radio checked={true}>
                                        <Space direction="vertical" size={8}>
                                            <Space>
                                                <Text strong>{addresses.name}</Text>
                                                <Text type="secondary">|</Text>
                                                <Text>{addresses.phoneNumber}</Text>
                                                {addresses.isDefault && (
                                                    <Text type="success" style={{ marginLeft: 8 }}>
                                                        Default
                                                    </Text>
                                                )}
                                            </Space>
                                            <Space align="start">
                                                <HomeOutlined style={{ marginTop: 4 }} />
                                                <Text>
                                                    {addresses.addressDetail}, {addresses.district}, {addresses.ward}, {addresses.city}
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
                                            onClick={() => showModal(addresses)}
                                        />
                                        <ActionButton
                                            type="text"
                                            className="delete-btn"
                                            icon={<DeleteOutlined />}
                                            onClick={(e) => console.log(e, addresses)}
                                        />
                                    </Space>
                                </Col>
                            </Row>
                        </ModalAddressCard>
                    )}
                </Space>

            </Modal>
            <AddressModal
                isModalVisible={isModalVisible}
                handleCancel={handleCancel}
                setIsModalVisible={setIsModalVisible}
                form={form}
                editingAddress={editingAddress}
                getAddressByid={getInformationForCustomer}
            />
        </>
    );
};

export default Shipping;