import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Row, Col, Button, Select } from 'antd';
import { UserOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getDistrict, getProvinces, getWards } from '../../service/api.service';

const AddressModal = ({ isModalVisible, handleCancel, handleSubmit, form, editingAddress }) => {
    const { t, i18n } = useTranslation();
    const language = localStorage.getItem("language") || "vi";
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedWard, setSelectedWard] = useState(null);

    const [isDistrictDropdownOpen, setIsDistrictDropdownOpen] = useState(false);
    const [isWardDropdownOpen, setIsWardDropdownOpen] = useState(false);

    const defaultOption = { ProvinceID: '', DistrictID: '', WardCode: '', ProvinceName: t('MES-024'), DistrictName: t('MES-027'), WardName: t('MES-030') };

    // API gọi danh sách tỉnh
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
        if (selectedProvince && selectedProvince !== defaultOption.ProvinceID) {
            const fetchDistricts = async () => {
                const res = await getDistrict(selectedProvince);
                setDistricts([defaultOption, ...res.data.data]);
                setSelectedDistrict(defaultOption.DistrictID);
                setSelectedWard(defaultOption.WardCode);
                setIsDistrictDropdownOpen(true);
            };
            fetchDistricts();
        } else {
            setDistricts([]);
            setWards([]);
            setSelectedDistrict(null);
            setSelectedWard(null);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict && selectedDistrict !== defaultOption.DistrictID) {
            const fetchWards = async () => {
                const res = await getWards(selectedDistrict);
                setWards([defaultOption, ...res.data.data]);
                setSelectedWard(defaultOption.WardCode);
                setIsWardDropdownOpen(true);
            };
            fetchWards();
        } else {
            setWards([]);
            setSelectedWard(null);
        }
    }, [selectedDistrict]);

    // Tự động cập nhật địa chỉ
    const autoAddress = `${provinces.find(p => p.ProvinceID === selectedProvince)?.ProvinceName || ''}, ${districts.find(d => d.DistrictID === selectedDistrict)?.DistrictName || ''}, ${wards.find(w => w.WardCode === selectedWard)?.WardName || ''}`;

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
                onFinish={handleSubmit}
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
                            setSelectedProvince(value);
                            setIsDistrictDropdownOpen(true);
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

                {selectedProvince && (
                    <Form.Item
                        name="district"
                        label={t('MES-028')}
                        rules={[{ required: true, message: t('MES-029') }]}
                    >
                        <Select
                            open={isDistrictDropdownOpen}
                            onDropdownVisibleChange={(open) => setIsDistrictDropdownOpen(open)}
                            value={selectedDistrict}
                            onChange={(value) => {
                                setSelectedDistrict(value);
                                setIsDistrictDropdownOpen(false);
                                setIsWardDropdownOpen(true);
                            }}
                            placeholder={t('MES-027')}
                            disabled={!selectedProvince || selectedProvince === defaultOption.ProvinceID}
                        >
                            {districts.map(district => (
                                <Select.Option key={district.DistrictID} value={district.DistrictID}>
                                    {district.DistrictName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                )}

                {selectedDistrict && (
                    <Form.Item
                        name="ward"
                        label={t('MES-031')}
                        rules={[{ required: true, message: t('MES-032') }]}
                    >
                        <Select
                            open={isWardDropdownOpen}
                            onDropdownVisibleChange={(open) => setIsWardDropdownOpen(open)}
                            value={selectedWard}
                            onChange={(value) => {
                                setSelectedWard(value);
                                setIsWardDropdownOpen(false);
                            }}
                            placeholder={t('MES-030')}
                            disabled={!selectedDistrict || selectedDistrict === defaultOption.DistrictID}
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
                    name="address"
                    label={t('MES-041')}
                    rules={[{ required: true, message: t('MES-042') }]}
                >
                    <Input.TextArea
                        prefix={<EnvironmentOutlined />}
                        placeholder={t('MES-043')}
                        rows={3}
                        value={autoAddress}
                        onChange={(e) => form.setFieldValue('address', e.target.value)}
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
                                {t('MES-044')}
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
                                type="primary" htmlType="submit"
                                disabled={!selectedProvince || !selectedDistrict || !selectedWard}
                            >
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
