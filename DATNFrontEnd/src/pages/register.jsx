import { Button, Input, Form, notification, DatePicker, Row, Col, Divider, Steps } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomerAPI } from "../service/api.service";
import { useState } from "react";

const RegisterPage = () => {
    const [form] = Form.useForm();
    const [usernameError, setUsernameError] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();

    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    const formCardStyle = {
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
    };

    const headerStyle = {
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: '600',
        color: '#000000',
        marginBottom: '20px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    };

    const inputStyle = {
        height: '40px',
        borderRadius: '4px',
        border: '1px solid #d9d9d9'
    };

    const buttonStyle = {
        height: '40px',
        backgroundColor: '#000000',
        borderColor: '#000000',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: '500'
    };

    const linkStyle = {
        color: '#000000',
        textDecoration: 'underline',
        fontWeight: '500'
    };

    const labelStyle = {
        color: '#000000',
        fontWeight: '500',
        marginBottom: '4px'
    };

    const stepsStyle = {
        marginBottom: '24px'
    };

    const onFinish = async (values) => {
        if (currentStep === 0) {
            // Validate first step
            try {
                await form.validateFields(['username', 'password', 'confirm_password']);
                setCurrentStep(1);
            } catch (error) {
                return;
            }
        } else {
            // Submit final form
            try {
                const res = await registerCustomerAPI(
                    values.username,
                    values.password,
                    values.confirm_password,
                    values.phone,
                    values.email,
                    values.dateOfBirth
                );

                if (res.data) {
                    notification.success({
                        message: "Success",
                        description: "Registration successful",
                        style: { borderRadius: '4px' }
                    });
                    navigate("/login");
                }
            } catch (error) {
                if (error.response && error.response.status === 406 && error.response.data.message.includes("Username has been taken")) {
                    setUsernameError("Username has been taken");
                    setCurrentStep(0); // Go back to first step if username is taken
                } else {
                    notification.error({
                        message: "Registration Error",
                        description: error.message,
                        style: { borderRadius: '4px' }
                    });
                }
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
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username',
                            },
                        ]}
                    >
                        <Input style={inputStyle} />
                    </Form.Item>

                    <Form.Item
                        label={<span style={labelStyle}>Password</span>}
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password',
                            },
                        ]}
                    >
                        <Input.Password style={inputStyle} />
                    </Form.Item>

                    <Form.Item
                        label={<span style={labelStyle}>Confirm Password</span>}
                        name="confirm_password"
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
                        name="phone"
                        rules={[
                            {
                                required: true,
                                pattern: new RegExp(/\d+/g),
                                message: "Please enter a valid phone number"
                            }
                        ]}
                    >
                        <Input style={inputStyle} />
                    </Form.Item>

                    <Form.Item
                        label={<span style={labelStyle}>Email</span>}
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email',
                            },
                            {
                                type: "email",
                                message: 'Please enter a valid email address',
                            },
                        ]}
                    >
                        <Input style={inputStyle} />
                    </Form.Item>

                    <Form.Item
                        label={<span style={labelStyle}>Date of Birth</span>}
                        name="dateOfBirth"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your date of birth',
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
                    items={steps.map(item => ({ title: item.title }))}
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

                    <Divider style={{ margin: '24px 0', borderColor: '#d9d9d9' }} />
                    
                    <div style={{ textAlign: 'center', fontSize: '14px' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={linkStyle}>
                            Sign in here
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default RegisterPage;