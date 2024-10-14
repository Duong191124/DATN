import React, { useState } from 'react';
import { Button, Col, DatePicker, Drawer, Form, Input, message, Row, Select, Space } from 'antd';
import { createNewStaff } from '../../service/api.service';

const { Option } = Select;

const CreateStaff = ({ open, onClose, loadStaff }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        setLoading(true);
    
        try {
            const res = await createNewStaff(
                values.username, 
                values.password, 
                values.phoneNumber, 
                values.email, 
                values.address, 
                values.name, 
                values.gender, 
                values.dateOfBirth
            );
            console.log(res);
            if (res.data) {
                message.success("Account created successfully");
                form.resetFields();
                onClose();
                loadStaff();
            }
        } catch (error) {
            notification.error({
                message: "Error Creating Account",
                description: error.response?.data?.message || JSON.stringify(error),
            });
        }
    
        setLoading(false);
    };

    return (
        <>
            <Drawer
                title="Create a new account"
                width={720}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button 
                            type="primary" 
                            onClick={() => form.submit()}
                        >
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" hideRequiredMark form={form} onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter username',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter username" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter password',
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Please enter password" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        type: 'email',
                                        message: 'Please enter a valid email',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter email" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phoneNumber"
                                label="Phone Number"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter phone number',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter phone number" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="address"
                                label="Address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter address',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter address" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="name"
                                label="Full Name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter your name',
                                    },
                                ]}
                            >
                                <Input placeholder="Please enter your name" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="dateOfBirth"
                                label="Date of Birth"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please choose your date of birth',
                                    },
                                ]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="Please select your birth date"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="gender"
                                label="Gender"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select your gender',
                                    },
                                ]}
                            >
                                <Select placeholder="Please select gender">
                                    <Option value={0}>Male</Option>
                                    <Option value={1}>Female</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </>
    );
};
export default CreateStaff;