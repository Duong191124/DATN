// ContactPage.jsx
import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { SendOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ContactContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const ContactCard = styled(motion.div)`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  width: 100%;
  max-width: 480px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Title = styled.h1`
  color: #000;
  text-align: center;
  margin-bottom: 25px;
  font-size: 2.2rem;
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const StyledForm = styled(Form)`
  .ant-form-item {
    margin-bottom: 20px;
  }

  .ant-input {
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    border: 2px solid #f0f0f0;
    transition: all 0.3s ease;

    &:hover, &:focus {
      border-color: #000;
      box-shadow: none;
    }
  }

  .ant-input-affix-wrapper {
    border-radius: 8px;
    padding: 3px 12px;
    border: 2px solid #f0f0f0;
    height: 45px;
    
    .anticon {
      font-size: 16px;
      color: #666;
    }
    
    &:hover, &:focus, &-focused {
      border-color: #000;
      box-shadow: none;
    }

    input {
      font-size: 14px;
    }
  }

  textarea.ant-input {
    min-height: 100px;
    font-size: 14px;
  }

  .ant-form-item-label label {
    font-size: 14px;
    font-weight: 500;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  height: 45px;
  background: #000;
  border-color: #000;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;

  &:hover, &:focus {
    background: #333;
    border-color: #333;
  }

  .anticon {
    font-size: 16px;
  }
`;

// Airplane component
const AirplaneContainer = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: -100px;
  transform: translateY(-50%);
  z-index: 1000;
`;

const Airplane = styled.div`
  color: #000;
  transform: rotate(90deg);
  
  svg {
    width: 40px;
    height: 40px;
  }
`;

const AirplaneIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M21,16v-2l-8-5V3.5C13,2.67,12.33,2,11.5,2S10,2.67,10,3.5V9l-8,5v2l8-2.5V19l-2,1.5V22l3.5-1l3.5,1v-1.5L13,19v-5.5L21,16z" />
    </svg>
);

const ContactPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [showPlane, setShowPlane] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        setShowPlane(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 4000));
            message.success({
                content: 'Message sent successfully!',
                style: {
                    marginTop: '20vh',
                    fontSize: '14px',
                },
            });
            form.resetFields();
        } catch (error) {
            message.error({
                content: 'Failed to send message. Please try again.',
                style: {
                    marginTop: '20vh',
                    fontSize: '14px',
                },
            });
        } finally {
            setLoading(false);
            setShowPlane(false);
        }
    };

    const formItemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0 }
    };

    const airplaneVariants = {
        initial: { x: -100 },
        animate: {
            x: window.innerWidth + 100,
            transition: {
                duration: 4,
                ease: "linear"
            }
        },
        exit: { x: window.innerWidth + 100 }
    };

    return (
        <>
            <div style={{ height: 30 }}></div>
            <ContactContainer>
                <AnimatePresence>
                    {showPlane && (
                        <AirplaneContainer
                            variants={airplaneVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <Airplane>
                                <AirplaneIcon />
                            </Airplane>
                        </AirplaneContainer>
                    )}
                </AnimatePresence>

                <ContactCard
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Title>Get In Touch</Title>
                    </motion.div>

                    <StyledForm
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        size="large"
                    >
                        <motion.div
                            variants={formItemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.3 }}
                        >
                            <Form.Item
                                label="Full Name"
                                name="name"
                                rules={[{ required: true, message: 'Please input your name!' }]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Enter your full name"
                                />
                            </Form.Item>
                        </motion.div>

                        <motion.div
                            variants={formItemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.4 }}
                        >
                            <Form.Item
                                label="Email Address"
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your email!' },
                                    { type: 'email', message: 'Please enter a valid email!' }
                                ]}
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    placeholder="Enter your email address"
                                />
                            </Form.Item>
                        </motion.div>

                        <motion.div
                            variants={formItemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.5 }}
                        >
                            <Form.Item
                                label="Phone Number"
                                name="phone"
                                rules={[{ required: true, message: 'Please input your phone number!' }]}
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    placeholder="Enter your phone number"
                                />
                            </Form.Item>
                        </motion.div>

                        <motion.div
                            variants={formItemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.6 }}
                        >
                            <Form.Item
                                label="Message"
                                name="message"
                                rules={[{ required: true, message: 'Please input your message!' }]}
                            >
                                <Input.TextArea
                                    placeholder="Write your message here..."
                                    autoSize={{ minRows: 4, maxRows: 6 }}
                                />
                            </Form.Item>
                        </motion.div>

                        <motion.div
                            variants={formItemVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: 0.7 }}
                        >
                            <Form.Item>
                                <SubmitButton
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    icon={<SendOutlined />}
                                >
                                    Send Message
                                </SubmitButton>
                            </Form.Item>
                        </motion.div>
                    </StyledForm>
                </ContactCard>
            </ContactContainer>
        </>
    );
};

export default ContactPage;