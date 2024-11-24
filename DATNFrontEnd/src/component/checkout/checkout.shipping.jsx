import React, { useState, useEffect } from 'react';
import { getAddressByCustomerId, getUserInfo, deleteAddressByid } from '../../service/api.service';
import { useCart } from '../context/cart.context';
import { useCheckout } from '../context/checkout.context';
import { Button, Space, Typography, Form, Input, Select, Row, Col, message } from 'antd';
import { SwapOutlined, HomeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import SelectAddressModal from '../address/address.update';
import AddressModal from '../address/address.select';

const { Title, Text } = Typography;
const { Option } = Select;

const Shipping = () => {
    const { t, i18n } = useTranslation();
    const { cartItems } = useCart();
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
        ward,
        selectAddress,
        setSelectAddress
    } = useCheckout();

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userId, setUserId] = useState(null); // Initialize userId state

    useEffect(() => {
        getInformationForCustomer();
    }, []);

    const getInformationForCustomer = async () => {
        try {
            const res = await getUserInfo();
            setUserId(res.data.data.id); // Set the userId from the response
            const addressData = await getAddressByCustomerId(res.data.data.id);
            if (addressData?.data?.data && addressData.data.data.length > 0) {
                const address = addressData.data.data[0];  // Get the first address if available

                setDistrict(address.district);
                setProvinces(address.city);
                setWard(address.ward);
                setFromDistrict(address.fromDistrict);
                setServiceId(address.serviceId);
                setAddresses(addressData.data.data);
            }
            const totalWeight = cartItems.reduce((total, cart) => {
                if (cart && cart.weight && cart.quantity) {
                    return total + cart.weight.weightValue * cart.quantity;
                }
                return total;
            }, 0);

            setWeight(totalWeight);
        } catch (error) {
            console.error(error);
        }
    };

    // const showModal = (address) => {
    //     setSelectAddress(address);
    //     setIsModalVisible(true);
    // };

    const handleAddNewAddress = () => {
        setSelectAddress(null);
        form.setFieldValue(null);
        setIsModalVisible(true);
    };

    const handleSelectAddress = (selectedAddress) => {
        resetGhnTotalPrice();
        const updatedAddresses = addresses.map((address) => ({
            ...address,
            selected: address.id === selectedAddress.id,
        }));
        setAddresses(updatedAddresses);
        setSelectAddress(selectedAddress);
        setIsModalOpen(false);
    };

    console.log(selectAddress);

    const handleEditAddress = (address) => {
        setIsModalVisible(true);
        setSelectAddress(address); // Pass the address to be edited
    };

    const handleDeleteAddress = async (address) => {
        try {
            await deleteAddressByid(address.id);
            message.success("Address deleted successfully");
            // Remove the address from the addresses list
            setAddresses(prevAddresses => prevAddresses.filter(a => a.id !== address.id));
        } catch (error) {
            message.error("Error deleting address");
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                <Title style={{ textAlign: 'center' }} level={4}>Shipping Address</Title>

                {/* Left and Right Buttons Container */}
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    {/* Left Button for Change Address */}
                    <Col>
                        <Button
                            type="primary"
                            icon={<SwapOutlined />}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Change Address
                        </Button>
                    </Col>

                    {/* Right Button for Add Address */}
                    <Col>
                        <Button
                            type="default"
                            icon={<HomeOutlined />}
                            onClick={handleAddNewAddress}
                        >
                            Add Address
                        </Button>
                    </Col>
                </Row>

                {/* Render the selected address or placeholder */}
                <Space direction="vertical" size={8}>
                    <Space>
                        <Text strong>{selectAddress ? selectAddress.name : 'No Address Selected'}</Text>
                        <Text type="secondary">|</Text>
                        <Text>{selectAddress ? selectAddress.phone : 'No phone number'}</Text>
                    </Space>
                    <Space align="start">
                        <HomeOutlined style={{ marginTop: 4 }} />
                        <Text>{selectAddress ? selectAddress.addressDetail : 'No address selected'}</Text>
                    </Space>
                </Space>
            </div>

            {/* Conditionally render the form for userId === 1 */}
            {userId === 1 && (
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
                                rules={[{ required: true, message: 'Please enter recipient name' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Phone Number"
                                rules={[{ required: true, message: 'Please enter phone number' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Please enter email' }, { type: 'email', message: 'Please enter a valid email' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="address"
                        label="Detailed Address"
                        rules={[{ required: true, message: 'Please enter detailed address' }]}>
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={8}>
                            <Form.Item
                                name="city"
                                label="City"
                                rules={[{ required: true, message: 'Please select city' }]}>
                                <Select
                                    placeholder="Select a city"
                                    onChange={(value) => {
                                        setProvinces(value);
                                        setDistrict([]);
                                        setWard([]);
                                    }}
                                    allowClear>
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
                                rules={[{ required: true, message: 'Please select district' }]}>
                                <Select
                                    placeholder="Select a district"
                                    onChange={(value) => setDistrict(value)}
                                    allowClear>
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
                                rules={[{ required: true, message: 'Please select ward' }]}>
                                <Select
                                    placeholder="Select a ward"
                                    onChange={(value) => setWard(value)}
                                    allowClear>
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
            )}

            {/* The SelectAddressModal */}
            <SelectAddressModal
                isModalOpen={isModalOpen}
                addresses={addresses}
                onAddNewAddress={handleAddNewAddress}
                onSelectAddress={handleSelectAddress}
                onEditAddress={handleEditAddress}
                onDeleteAddress={handleDeleteAddress}
                onCancel={handleCancel}
            />

            {/* Address Modal */}
            <AddressModal
                isModalVisible={isModalVisible}
                handleCancel={() => setIsModalVisible(false)}
                setIsModalVisible={setIsModalVisible}
                onAddressUpdated={getInformationForCustomer}
                form={form}
                editingAddress={selectAddress} // Pass the selected address to the modal for editing
            />
        </>
    );
};

export default Shipping;
