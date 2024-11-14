import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, message, Spin, Card } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, SaveOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';
import { motion } from 'framer-motion';
import axios from 'axios';

const { Option } = Select;

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8f8f8;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
    
    .ant-card-head-title {
      font-size: 24px;
      font-weight: 600;
    }
  }

  .ant-form-item-label {
    font-weight: 500;
  }

  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused,
  .ant-picker:focus,
  .ant-picker-focused,
  .ant-select-selector:focus,
  .ant-select-selector-focused {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
    border-color: #000;
  }
`;

const SubmitButton = styled(Button)`
  background: #000;
  border-color: #000;
  height: 45px;
  font-size: 16px;
  
  &:hover {
    background: #333 !important;
    border-color: #333 !important;
  }

  &:focus {
    background: #000;
    border-color: #000;
  }
`;

const LoadingIcon = styled(Spin)`
  .ant-spin-dot-item {
    background-color: #fff;
  }
`;

const InfoPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await axios.get('/api/user-info');
            const userData = response.data;

            form.setFieldsValue({
                ...userData,
                dateOfBirth: userData.dateOfBirth ? moment(userData.dateOfBirth) : undefined
            });
        } catch (error) {
            message.error('Failed to load user information');
        } finally {
            setInitialLoading(false);
        }
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            await axios.post('/api/update-user-info', values);
            message.success({
                content: 'Information updated successfully!',
                className: 'custom-message',
                style: {
                    marginTop: '20vh',
                },
            });
        } catch (error) {
            message.error('Failed to update information');
        } finally {
            setLoading(false);
        }
    };

    const validateMessages = {
        required: '${label} is required!',
        types: {
            email: '${label} is not a valid email!',
            number: '${label} is not a valid number!',
        },
    };

    if (initialLoading) {
        return (
            <PageWrapper>
                <StyledCard>
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin size="large" />
                    </div>
                </StyledCard>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '600px' }}
            >
                <StyledCard
                    title="Personal Information"
                    extra={<span style={{ color: '#888' }}>Update your profile</span>}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        validateMessages={validateMessages}
                        requiredMark={false}
                    >
                        <Form.Item
                            name="userName"
                            label="Username"
                            rules={[{ required: true }]}
                        >
                            <Input
                                prefix={<UserOutlined style={{ color: '#888' }} />}
                                placeholder="Enter your username"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[{ required: true, type: 'email' }]}
                        >
                            <Input
                                prefix={<MailOutlined style={{ color: '#888' }} />}
                                placeholder="Enter your email"
                            />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            label="Phone"
                            rules={[
                                { required: true },
                                { pattern: /^[0-9-+()]*$/, message: 'Please enter a valid phone number' }
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined style={{ color: '#888' }} />}
                                placeholder="Enter your phone number"
                            />
                        </Form.Item>

                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[{ required: true }]}
                        >
                            <Input
                                prefix={<HomeOutlined style={{ color: '#888' }} />}
                                placeholder="Enter your address"
                            />
                        </Form.Item>

                        <Form.Item
                            name="dateOfBirth"
                            label="Date of Birth"
                            rules={[{ required: true }]}
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                placeholder="Select your date of birth"
                            />
                        </Form.Item>

                        <Form.Item
                            name="gender"
                            label="Gender"
                            rules={[{ required: true }]}
                        >
                            <Select placeholder="Select your gender">
                                <Option value="male">Male</Option>
                                <Option value="female">Female</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <SubmitButton
                                type="primary"
                                htmlType="submit"
                                block
                                loading={loading}
                                icon={<SaveOutlined />}
                            >
                                {loading ? 'Saving Changes' : 'Save Changes'}
                            </SubmitButton>
                        </Form.Item>
                    </Form>
                </StyledCard>
            </motion.div>
        </PageWrapper>
    );
};

export default InfoPage;