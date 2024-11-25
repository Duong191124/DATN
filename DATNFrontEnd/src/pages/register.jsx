import { Button, Input, Form, notification, DatePicker, Steps, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomerAPI } from "../service/api.service";
import { useEffect, useState } from "react";
import moment from "moment/moment";

const RegisterPage = () => {
    const [form] = Form.useForm();
    const [usernameError, setUsernameError] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const formCardStyle = {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
    };

    const headerStyle = {
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: '600',
        color: '#000000',
        marginBottom: '20px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    };

    const inputStyle = {
        height: '40px',
        borderRadius: '4px',
        border: '1px solid #d9d9d9',
    };

    const buttonStyle = {
        height: '40px',
        backgroundColor: '#000000',
        borderColor: '#000000',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '500',
    };

    const linkStyle = {
        color: '#000000',
        textDecoration: 'underline',
        fontWeight: '500',
    };

    const labelStyle = {
        color: '#000000',
        fontWeight: '500',
        marginBottom: '4px',
    };

    const stepsStyle = {
        marginBottom: '24px',
    };

    const onFinish = async (values) => {
        const mergedData = {
            ...formData,
            ...values,
        };

        if (currentStep === 0) {
            try {
                await form.validateFields(['username', 'password', 'confirm_password']);
                setFormData(mergedData);
                setCurrentStep(1);
            } catch (error) {
                return;
            }
        } else {
            try {
                // Transform the payload keys here
                const apiPayload = {
                    username: mergedData.username,
                    password: mergedData.password,
                    confirm_password: mergedData.confirm_password,
                    phoneNumber: mergedData.phoneNumber, // Không đổi
                    email: mergedData.email,
                    dateOfBirth: mergedData.dateOfBirth,
                    name: mergedData.name || "",
                };

                await registerCustomerAPI(
                    apiPayload.username,
                    apiPayload.password,
                    apiPayload.confirm_password,
                    apiPayload.phoneNumber,
                    apiPayload.email,
                    apiPayload.dateOfBirth,
                    apiPayload.name
                );

                notification.success({
                    message: "Registration Successful",
                    description: "Your account has been successfully created.",
                    style: { borderRadius: '4px' },
                });

                navigate('/login-fork'); // Redirect to login page upon success
            } catch (error) {
                notification.error({
                    message: "Registration Error",
                    description: error.message,
                    style: { borderRadius: '4px' },
                });
            }
        }
    };

    const steps = [
        {
            title: 'Account',
            content: (
                <>
                    <Form.Item
                        label={<span style={labelStyle}>Username</span>}
                        name="username"
                        validateStatus={usernameError ? "error" : ""}
                        initialValue={formData.username} // Set initial value from formData
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username',
                            },
                            {
                                min: 6,
                                message: 'Username must be at least 6 characters',
                            },
                        ]}
                    >
                        <Input style={inputStyle} />
                    </Form.Item>

                    <Form.Item
                        label={<span style={labelStyle}>Password</span>}
                        name="password"
                        initialValue={formData.password} // Set initial value from formData
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password',
                            },
                            {
                                min: 6,
                                message: 'Password must be at least 6 characters',
                            },
                            {
                                pattern: /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/,
                                message: 'Password must include at least one letter and one number',
                            },
                        ]}
                    >
                        <Input.Password style={inputStyle} />
                    </Form.Item>

                    <Form.Item
                        label={<span style={labelStyle}>Confirm Password</span>}
                        name="confirm_password"
                        initialValue={formData.confirm_password} // Set initial value from formData
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password style={inputStyle} />
                    </Form.Item>
                </>
            ),
        },
        {
            title: 'Info',
            content: (
                <>
                    <Form.Item
                        label={<span style={labelStyle}>Phone Number</span>}
                        name="phoneNumber"
                        initialValue={formData.phoneNumber} // Set initial value from formData
                        rules={[
                            {
                                required: true,
                                message: 'Please enter your phone number',
                            },
                            {
                                pattern: /^(0|\+84)[3-9]\d{8}$/,
                                message: 'Please enter a valid Vietnamese phone number',
                            },
                        ]}
                    >
                        <Input style={inputStyle} />
                    </Form.Item>

                    <Form.Item
                        label={<span style={labelStyle}>Email</span>}
                        name="email"
                        initialValue={formData.email} // Set initial value from formData
                        rules={[
                            {
                                required: true,
                                type: 'email',
                                message: 'Please enter a valid email address',
                            },
                        ]}
                    >
                        <Input style={inputStyle} />
                    </Form.Item>

                    <Form.Item
                        label={<span style={labelStyle}>Name</span>}
                        name="name"
                        initialValue={formData.name} // Set initial value from formData
                        rules={[
                            {
                                required: true,
                                message: 'Please input your name',
                            },
                        ]}
                    >
                        <Input style={inputStyle} />
                    </Form.Item>

                    <Form.Item
                        label={<span style={labelStyle}>Date of Birth</span>}
                        name="dateOfBirth"
                        initialValue={formData.dateOfBirth} // Set initial value from formData
                        rules={[
                            {
                                required: true,
                                message: 'Please select your date of birth',
                            },
                            {
                                validator(_, value) {
                                    const now = new Date();
                                    const minAgeDate = new Date(now.getFullYear() - 16, now.getMonth(), now.getDate());
                                    if (value && value.toDate() > minAgeDate) {
                                        return Promise.reject(new Error('You must be at least 16 years old'));
                                    }
                                    return Promise.resolve();
                                },
                            },
                            {
                                validator(_, value) {
                                    const now = new Date();
                                    const maxAgeDate = new Date(now.getFullYear() - 100, now.getMonth(), now.getDate());
                                    if (value && value.toDate() < maxAgeDate) {
                                        return Promise.reject(new Error('Your age must be below 100 years'));
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <DatePicker style={inputStyle} />
                    </Form.Item>
                </>
            ),
        },
    ];

    const prev = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <div style={containerStyle}>
            <div style={formCardStyle}>
                <h3 style={headerStyle}>Create Account</h3>

                <Steps
                    current={currentStep}
                    items={steps.map((item) => ({ title: item.title }))}
                    style={stepsStyle}
                    size="small"
                />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    {steps[currentStep].content}

                    <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
                        {currentStep > 0 && (
                            <Button
                                style={{ ...buttonStyle, backgroundColor: '#fff', color: '#000' }}
                                onClick={prev}
                            >
                                Previous
                            </Button>
                        )}
                        <Button
                            type="primary"
                            onClick={() => form.submit()}
                            style={{ ...buttonStyle, flex: 1 }}
                        >
                            {currentStep === steps.length - 1 ? 'Register' : 'Next'}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;
