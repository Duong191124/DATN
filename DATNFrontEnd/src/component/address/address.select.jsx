import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Button, Select, message } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getDistrict, getProvinces, getWards, saveAddressByid, updateAddressByid } from '../../service/api.service';

const AddressModal = ({ isModalVisible, handleCancel, setIsModalVisible, form, editingAddress, getAddressByid, onAddressUpdated }) => {
    const { t, i18n } = useTranslation();
    const language = localStorage.getItem("language") || "vi";
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const userId = localStorage.getItem('userId');

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const [addressDetails, setAddressDetails] = useState({
        province: '',
        district: '',
        ward: '',
        stressAddress: '',
    });

    const defaultOption = { ProvinceID: '', DistrictID: '', WardCode: '', ProvinceName: t('MES-024'), DistrictName: t('MES-027'), WardName: t('MES-030') };

    useEffect(() => {
        const fetchProvinces = async () => {
            const res = await getProvinces();
            setProvinces([defaultOption, ...res.data.data]);
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        i18n.changeLanguage(language);
    }, [i18n, language]);

    useEffect(() => {
        if (editingAddress) {
            const { name, phoneNumber, city, district, ward, addressDetail } = editingAddress;
            form.setFieldsValue({
                name,
                phone: phoneNumber,
                province: city,
                district,
                ward,
                address: addressDetail,
            });
            setSelectedProvince(city);
            setSelectedDistrict(district);
            setSelectedWard(ward);
            setAddressDetails({
                province: city,
                district,
                ward,
                stressAddress: '',
            });
        }
    }, [editingAddress, form]);

    useEffect(() => {
        if (selectedProvince && selectedProvince !== defaultOption.ProvinceID) {
            const fetchDistricts = async () => {
                const res = await getDistrict(selectedProvince);
                setDistricts([defaultOption, ...res.data.data]);
            };
            fetchDistricts();
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict && selectedDistrict !== defaultOption.DistrictID) {
            const fetchWards = async () => {
                const res = await getWards(selectedDistrict);
                setWards([defaultOption, ...res.data.data]);
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedDistrict]);

    useEffect(() => {
        const { province, district, ward, stressAddress } = addressDetails;

        if (province && district && ward && stressAddress) {
            const fullAddress = `${stressAddress}, ${ward}, ${district}, ${province}`;
            form.setFieldsValue({ address: fullAddress });
        } else {
            form.setFieldsValue({ address: '' });
        }
    }, [addressDetails, form]);

    const onFormSubmit = async (values) => {
        try {
            if (editingAddress) {
                await updateAddressByid(
                    editingAddress.id,
                    values.province,
                    values.district,
                    values.ward,
                    values.name,
                    values.phone,
                    values.address,
                );
                message.success(t('MES-046'));
                getAddressByid();
            } else {
                await saveAddressByid(
                    userId,
                    values.province,
                    values.district,
                    values.ward,
                    values.name,
                    values.phone,
                    values.address,
                );
                message.success(t('MES-047'));
                getAddressByid();
            }
            setIsModalVisible(false);

            if (onAddressUpdated) {
                onAddressUpdated();
            }
        } catch (error) {
            message.error(`${t('MES-048')}: ${error}`);
        }
    };

    return (
        <Modal
            title={editingAddress ? t('MES-033') : t('MES-034')}
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFormSubmit}
            >
                <Form.Item
                    name="name"
                    label={t('MES-035')}
                    rules={[{ required: true, message: t('MES-036') }]}
                >
                    <Input prefix={<UserOutlined />} placeholder={t('MES-037')} />
                </Form.Item>
                <Form.Item
                    name="phone"
                    label={t('MES-038')}
                    rules={[{ required: true, message: t('MES-039') }]}
                >
                    <Input prefix={<PhoneOutlined />} placeholder={t('MES-040')} />
                </Form.Item>

                <Form.Item
                    name="province"
                    label={t('MES-025')}
                    rules={[{ required: true, message: t('MES-026') }]}
                >
                    <Select
                        value={selectedProvince}
                        onChange={(value) => {
                            const provinceName = provinces.find(p => p.ProvinceID === value)?.ProvinceName || '';
                            setSelectedProvince(value);
                            setSelectedDistrict(null);
                            setSelectedWard(null);
                            form.setFieldsValue({ district: null, ward: null });
                            setAddressDetails(prev => ({ ...prev, province: provinceName, district: '', ward: '' }));
                        }}
                        placeholder={t('MES-024')}
                    >
                        {provinces.map(province => (
                            <Select.Option key={province.ProvinceID} value={province.ProvinceID}>
                                {province.ProvinceName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                {districts.length > 0 && (
                    <Form.Item
                        name="district"
                        label={t('MES-028')}
                        rules={[{ required: true, message: t('MES-029') }]}
                    >
                        <Select
                            value={selectedDistrict}
                            onChange={(value) => {
                                const districtName = districts.find(d => d.DistrictID === value)?.DistrictName || '';
                                setSelectedDistrict(value);
                                setSelectedWard(null);
                                form.setFieldsValue({ ward: null });
                                setAddressDetails(prev => ({ ...prev, district: districtName, ward: '' }));
                            }}
                            placeholder={t('MES-027')}
                        >
                            {districts.map(district => (
                                <Select.Option key={district.DistrictID} value={district.DistrictID}>
                                    {district.DistrictName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                {wards.length > 0 && (
                    <Form.Item
                        name="ward"
                        label={t('MES-031')}
                        rules={[{ required: true, message: t('MES-032') }]}
                    >
                        <Select
                            value={selectedWard}
                            onChange={(value) => {
                                const wardName = wards.find(w => w.WardCode === value)?.WardName || '';
                                setSelectedWard(value);
                                setAddressDetails(prev => ({ ...prev, ward: wardName }));
                            }}
                            placeholder={t('MES-030')}
                        >
                            {wards.map(ward => (
                                <Select.Option key={ward.WardCode} value={ward.WardCode}>
                                    {ward.WardName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                <Form.Item
                    name="stressAddress"
                    label={t('Street Address')}
                    rules={[{ required: true, message: t('Stress address is required') }]}
                >
                    <Input
                        rows={3}
                        placeholder={t('Enter your stress address')}
                        onChange={(e) => setAddressDetails(prev => ({ ...prev, stressAddress: e.target.value }))}
                    />
                </Form.Item>

                <Form.Item
                    name="address"
                    label={t('MES-041')}
                    rules={[{ required: true, message: t('MES-042') }]}
                >
                    <Input.TextArea rows={3} placeholder={t('MES-043')} disabled />
                </Form.Item>

                <Form.Item>
                    <Row gutter={16} justify="end">
                        <Col>
                            <Button onClick={handleCancel}>{t('MES-044')}</Button>
                        </Col>
                        <Col>
                            <Button style={{
                                backgroundColor: 'black',
                                width: 130,
                            }} type="primary" htmlType="submit">
                                {t('MES-045')}
                            </Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddressModal;
