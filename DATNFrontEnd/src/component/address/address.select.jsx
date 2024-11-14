import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Button, Select } from 'antd';
import { UserOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const AddressModal = ({ isModalVisible, handleCancel, handleSubmit, form, editingAddress }) => {
    const { t } = useTranslation();

    // State để lưu danh sách tỉnh, huyện, xã
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    // State để lưu các giá trị chọn
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    // Gọi API lấy Tỉnh
    useEffect(() => {
        // Giả sử API trả về danh sách tỉnh
        const fetchProvinces = async () => {
            // Thực hiện gọi API để lấy danh sách tỉnh
            const provincesData = await fetch('/api/provinces').then(res => res.json());
            setProvinces(provincesData);
        };

        fetchProvinces();
    }, []);

    // Gọi API lấy Huyện theo Tỉnh đã chọn
    useEffect(() => {
        if (selectedProvince) {
            const fetchDistricts = async () => {
                // Thực hiện gọi API lấy huyện theo tỉnh
                const districtsData = await fetch(`/api/districts?provinceId=${selectedProvince}`).then(res => res.json());
                setDistricts(districtsData);
                setSelectedDistrict(null); // Reset huyện khi thay đổi tỉnh
                setSelectedWard(null); // Reset xã khi thay đổi huyện
            };

            fetchDistricts();
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince]);

    // Gọi API lấy Xã theo Huyện đã chọn
    useEffect(() => {
        if (selectedDistrict) {
            const fetchWards = async () => {
                // Thực hiện gọi API lấy xã theo huyện
                const wardsData = await fetch(`/api/wards?districtId=${selectedDistrict}`).then(res => res.json());
                setWards(wardsData);
                setSelectedWard(null); // Reset xã khi thay đổi huyện
            };

            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    return (
        <Modal
            title={editingAddress ? t('Edit Address') : t('Add New Address')}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
            style={{
                borderRadius: 1
            }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label={t('Recipient Name')}
                    rules={[{ required: true, message: t('Please input recipient name!') }]}
                >
                    <Input prefix={<UserOutlined />} placeholder={t('Enter recipient name')} />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label={t('Phone Number')}
                    rules={[{ required: true, message: t('Please input phone number!') }]}
                >
                    <Input prefix={<PhoneOutlined />} placeholder={t('Enter phone number')} />
                </Form.Item>

                <Form.Item
                    name="province"
                    label={t('Province')}
                    rules={[{ required: true, message: t('Please select province!') }]}
                >
                    <Select
                        value={selectedProvince}
                        onChange={setSelectedProvince}
                        placeholder={t('Select province')}
                    >
                        {provinces.map(province => (
                            <Select.Option key={province.id} value={province.id}>
                                {province.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="district"
                    label={t('District')}
                    rules={[{ required: true, message: t('Please select district!') }]}
                >
                    <Select
                        value={selectedDistrict}
                        onChange={setSelectedDistrict}
                        placeholder={t('Select district')}
                        disabled={!selectedProvince}
                    >
                        {districts.map(district => (
                            <Select.Option key={district.id} value={district.id}>
                                {district.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="ward"
                    label={t('Ward')}
                    rules={[{ required: true, message: t('Please select ward!') }]}
                >
                    <Select
                        value={selectedWard}
                        onChange={setSelectedWard}
                        placeholder={t('Select ward')}
                        disabled={!selectedDistrict}
                    >
                        {wards.map(ward => (
                            <Select.Option key={ward.id} value={ward.id}>
                                {ward.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="address"
                    label={t('Address')}
                    rules={[{ required: true, message: t('Please input address!') }]}
                >
                    <Input.TextArea
                        prefix={<EnvironmentOutlined />}
                        placeholder={t('Enter detailed address')}
                        rows={3}
                    />
                </Form.Item>

                <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col>
                            <Button
                                style={{
                                    backgroundColor: 'white',
                                    color: 'black',
                                    width: 100,
                                    height: 40
                                }}
                                onClick={handleCancel}>
                                {t('Cancel')}
                            </Button>
                        </Col>
                        <Col>
                            <Button
                                style={{
                                    backgroundColor: 'black',
                                    color: 'white',
                                    width: 100,
                                    height: 40
                                }}
                                type="primary" htmlType="submit">
                                {t('Save')}
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddressModal;
