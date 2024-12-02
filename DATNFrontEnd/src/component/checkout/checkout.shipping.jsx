import React, { useState, useEffect } from 'react';
import { getAddressByCustomerId, getUserInfo, deleteAddressByid, getProvinces, getDistrict, getWards } from '../../service/api.service';
import { useCart } from '../context/cart.context';
import { useCheckout } from '../context/checkout.context';
import { Button, Space, Typography, Form, Input, Select, Row, Col, message } from 'antd';
import { SwapOutlined, HomeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import SelectAddressModal from '../address/address.update';
import AddressModal from '../address/address.select';

const { Title, Text } = Typography;
const { Option } = Select;

const defaultOption = { ProvinceID: '', ProvinceName: 'Select', DistrictID: '', DistrictName: 'Select', WardCode: '', WardName: 'Select' };

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
    const [userId, setUserId] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    useEffect(() => {
        getInformationForCustomer();
    }, []);

    const getInformationForCustomer = async () => {
        try {
            const res = await getUserInfo();
            setUserId(res.data.data.id);
            const addressData = await getAddressByCustomerId(res.data.data.id);
            if (addressData?.data?.data && addressData.data.data.length > 0) {
                const address = addressData.data.data[0];
                setDistrict(address.district);
                setProvinces(address.city);
                setWard(address.ward);
                setFromDistrict(address.fromDistrict);
                setServiceId(address.serviceId);
                setAddresses(addressData.data.data);
            }
            const totalWeight = cartItems.reduce((total, cart) => {
                if (cart && cart.weight && cart.quantity) {
                    return total + cart.weight * cart.quantity;
                }
                return total;
            }, 0);
            setWeight(totalWeight);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        const fetchProvinces = async () => {
            const res = await getProvinces();
            setProvinces([defaultOption, ...res.data.data]);
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince && selectedProvince !== defaultOption.ProvinceID) {
            const fetchDistricts = async () => {
                const res = await getDistrict(selectedProvince);
                if (res && res.data && res.data.data) {
                    setDistricts([defaultOption, ...res.data.data]);
                }
            };
            fetchDistricts();
            setSelectedDistrict(null); // Reset district and ward on province change
            setWards([]);
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict && selectedDistrict !== defaultOption.DistrictID) {
            const fetchWards = async () => {
                const res = await getWards(selectedDistrict);
                if (res && res.data && res.data.data) {
                    setWards([defaultOption, ...res.data.data]);
                }
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    const handleAddNewAddress = () => {
        setSelectAddress(null);
        form.setFieldsValue(null);
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

    const handleEditAddress = (address) => {
        setIsModalVisible(true);
        setSelectAddress(address);
        setIsModalOpen(false);
    };

    const handleDeleteAddress = async (address) => {
        try {
            await deleteAddressByid(address.id);
            message.success("Address deleted successfully");
            setAddresses((prevAddresses) => prevAddresses.filter((a) => a.id !== address.id));
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

                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Col>
                        <Button type="primary" icon={<SwapOutlined />} onClick={() => setIsModalOpen(true)}>
                            Change Address
                        </Button>
                    </Col>
                    <Col>
                        <Button type="default" icon={<HomeOutlined />} onClick={handleAddNewAddress}>
                            Add Address
                        </Button>
                    </Col>
                </Row>

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

            {userId === 1 && (
                <Form form={form} layout="vertical" style={{ maxWidth: '100%' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Recipient Name" rules={[{ required: true, message: 'Please enter recipient name' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please enter phone number' }]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }, { type: 'email', message: 'Please enter a valid email' }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="address" label="Detailed Address" rules={[{ required: true, message: 'Please enter detailed address' }]}>
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
                        setSelectedProvince(value);
                        form.setFieldsValue({
                            district: null,
                            ward: null,
                        }); // Reset values of district and ward
                        setSelectedDistrict(null); // Clear district selection
                        setDistricts([]); // Clear districts options
                        setWards([]); // Clear wards options
                    }}
                    allowClear
                >
                    {Array.isArray(provinces) &&
                        provinces.map((province) => (
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
                        setSelectedDistrict(value);
                        form.setFieldsValue({
                            ward: null,
                        }); // Reset ward value
                        setWards([]); // Clear wards options
                    }}
                    disabled={!selectedProvince} // Disable if province is not selected
                    allowClear
                >
                    {Array.isArray(districts) &&
                        districts.map((district) => (
                            <Option key={district.DistrictID} value={district.DistrictID}>
                                {district.DistrictName}
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
                    onChange={(value) => setWard(value)}
                    disabled={!selectedDistrict} // Disable if district is not selected
                    allowClear
                >
                    {Array.isArray(wards) &&
                        wards.map((ward) => (
                            <Option key={ward.WardCode} value={ward.WardCode}>
                                {ward.WardName}
                            </Option>
                        ))}
                </Select>
            </Form.Item>
        </Col>
    </Row>
                </Form>
            )}

            <SelectAddressModal
                isModalOpen={isModalOpen}
                addresses={addresses}
                onAddNewAddress={handleAddNewAddress}
                onSelectAddress={handleSelectAddress}
                onEditAddress={handleEditAddress}
                onDeleteAddress={handleDeleteAddress}
                onCancel={handleCancel}
            />

            <AddressModal
                isModalVisible={isModalVisible}
                handleCancel={() => setIsModalVisible(false)}
                setIsModalVisible={setIsModalVisible}
                onAddressUpdated={getInformationForCustomer}
                form={form}
                editingAddress={selectAddress}
            />
        </>
    );
};

export default Shipping;
