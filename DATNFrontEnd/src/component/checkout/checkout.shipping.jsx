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
        setSelectAddress,
        setShippingData
    } = useCheckout();

    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userId, setUserId] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [email, setEmail] = useState("");
    const [addressDetails, setAddressDetails] = useState({
        city: '',
        district: '',
        ward: '',
        stressAddress: '',
    });

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
                console.log(total, cart);
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

    const handleChange = () => {
        const { province, district, ward, stressAddress } = addressDetails;

        // Kiểm tra và tạo chuỗi địa chỉ đầy đủ
        const fullAddress = [
            stressAddress?.trim(),
            ward?.trim(),
            district?.trim(),
            province?.trim()
        ]
            .filter(Boolean) // Loại bỏ các giá trị null, undefined hoặc chuỗi rỗng
            .join(', '); // Kết hợp thành chuỗi với dấu phẩy

        // Cập nhật giá trị vào form
        form.setFieldsValue({ address: fullAddress || "" });

        // Cập nhật dữ liệu vận chuyển
        setShippingData({
            name,
            phoneNumber,
            email,
            toProvide: selectedProvince,
            toDistrict: selectedDistrict,
            toWard: selectedWard,
            addressDetail: fullAddress || "",
        });
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
            setSelectedWard(null)
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    const handleAddNewAddress = () => {
        setSelectAddress(null);
        form.setFieldsValue(null);
        setIsModalVisible(true);
    };

    useEffect(() => {
        handleChange();
    }, [addressDetails, form, selectedProvince, selectedDistrict, selectedWard, name, phoneNumber, email]);

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
            </div>
            {userId !== 1 && (
                <div style={{ paddingTop: '12px', paddingBottom: '12px' }}>
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
            )}

            {userId === 1 && (
                <Form form={form} layout="vertical" style={{ maxWidth: '100%' }}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="name" label="Recipient Name" rules={[{ required: true, message: 'Please enter recipient name' }]}>
                                <Input value={name} onChange={(e) => { setName(e.target.value); handleChange() }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="phone" label="Phone Number" rules={[{ required: true, message: 'Please enter phone number' }]}>
                                <Input value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value); handleChange() }} />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }, { type: 'email', message: 'Please enter a valid email' }]}>
                        <Input value={email} onChange={(e) => { setEmail(e.target.value); handleChange() }} />
                    </Form.Item>

                    <Form.Item
                        name="stressAddress"
                        label={t('Street Address')}
                        rules={[{ required: true, message: t('Stress address is required') }]}
                    >
                        <Input
                            rows={3}
                            placeholder={t('Enter your stress address')}
                            value={streetAddress}
                            onChange={(e) => { setAddressDetails(prev => ({ ...prev, stressAddress: e.target.value })); setStreetAddress(e.target.value); handleChange() }}
                        />
                    </Form.Item>
                    <Form.Item name="address" label="Detailed Address" rules={[{ required: true, message: 'Please enter detailed address' }]}>
                        <Input.TextArea rows={3} disabled />
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
                                    value={selectedProvince}
                                    onChange={(value) => {
                                        const provinceName = provinces.find(p => p.ProvinceID === value)?.ProvinceName || '';
                                        setSelectedProvince(value);
                                        handleChange()
                                        form.setFieldsValue({
                                            district: null,
                                            ward: null,
                                        }); // Reset values of district and ward
                                        setSelectedDistrict(null); // Clear district selection
                                        setDistricts([]); // Clear districts options
                                        setWards([]); // Clear wards options
                                        setAddressDetails(prev => ({ ...prev, province: provinceName, district: '', ward: '' }));
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
                                    value={selectedDistrict}
                                    onChange={(value) => {
                                        const districtName = districts.find(d => d.DistrictID === value)?.DistrictName || '';
                                        setSelectedDistrict(value);
                                        handleChange()
                                        form.setFieldsValue({
                                            ward: null,
                                        }); // Reset ward value
                                        setWards([]); // Clear wards options
                                        setAddressDetails(prev => ({ ...prev, district: districtName, ward: '' }));
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
                                    value={selectedWard}
                                    onChange={(value) => {
                                        const wardName = wards.find(w => w.WardCode === value)?.WardName || '';
                                        setSelectedWard(value)
                                        handleChange()
                                        setAddressDetails(prev => ({ ...prev, ward: wardName }));
                                    }}
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
