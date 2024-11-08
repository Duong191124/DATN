import React, { useState } from 'react';
import { Form, Input, Button, Select, Checkbox, Modal, Row, Col, Slider } from 'antd';

const { Option } = Select;

const SelectAddress = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [phoneNumber, setPhoneNumber] = useState(0);

    const onFinish = (values) => {
        console.log('Form values:', { ...values, phoneNumber });
    };

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSliderChange = (value) => {
        setPhoneNumber(value);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
            <Modal title="Address" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={null}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ maxWidth: 600, margin: '0 auto' }}
                >
                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please enter your full name' }]}
                    >
                        <Input placeholder="Full Name" style={{ borderRadius: 4 }} />
                    </Form.Item>

                    <Form.Item label="Phone Number">
                        <Slider
                            min={0}
                            max={9999999999}
                            value={phoneNumber}
                            onChange={handleSliderChange}
                            step={1}
                        />
                        <div style={{ textAlign: 'center', marginTop: 10 }}>
                            <span>Selected Phone Number: {phoneNumber.toString().padStart(10, '0')}</span>
                        </div>
                    </Form.Item>

                    <Form.Item
                        label="City/District/Ward"
                        name="address"
                        rules={[{ required: true, message: 'Please select an address' }]}
                    >
                        <Row gutter={16}>
                            <Col span={8}>
                                <Select placeholder="City" style={{ borderRadius: 4 }}>
                                    <Option value="hanoi">Hanoi</Option>
                                    <Option value="tphcm">Ho Chi Minh City</Option>
                                </Select>
                            </Col>
                            <Col span={8}>
                                <Select placeholder="District" style={{ borderRadius: 4 }}>
                                    <Option value="hoankiem">Hoan Kiem</Option>
                                    <Option value="1">District 1</Option>
                                </Select>
                            </Col>
                            <Col span={8}>
                                <Select placeholder="Ward" style={{ borderRadius: 4 }}>
                                    <Option value="phuong1">Ward 1</Option>
                                    <Option value="phuong2">Ward 2</Option>
                                </Select>
                            </Col>
                        </Row>
                    </Form.Item>

                    <Form.Item
                        label="Detailed Address"
                        name="detailedAddress"
                        rules={[{ required: true, message: 'Please enter the detailed address' }]}
                    >
                        <Input placeholder="Detailed Address" style={{ borderRadius: 4 }} />
                    </Form.Item>

                    <Form.Item label="Address Type" name="addressType">
                        <Select placeholder="Select Address Type" style={{ borderRadius: 4 }}>
                            <Option value="nharieng">Private House</Option>
                            <Option value="vanphong">Office</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="defaultAddress" valuePropName="checked">
                        <Checkbox>Set as default address</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" style={{ float: "right", marginLeft: 20, padding: '10px 20px', fontSize: 16, borderRadius: 4 }} htmlType="submit">
                            Save
                        </Button>
                        <Button type="default" style={{ float: "right", padding: '10px 20px', fontSize: 16, borderRadius: 4 }}>
                            Back
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default SelectAddress;
