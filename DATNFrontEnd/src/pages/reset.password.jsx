import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { updatePassword } from '../service/api.service';

const ResetPassword = () => {
    // Using useLocation to get query parameters from the URL
    const location = useLocation();
    const navigate = useNavigate();
    // Function to get the query parameters
    const getQueryParams = (param) => {
        const urlParams = new URLSearchParams(location.search);
        return urlParams.get(param);
    };

    // Get the email and code from URL
    const email = getQueryParams('email');
    const code = getQueryParams('code');

    // Handle form submission
    const handleSubmit = async (values) => {
        const { newPassword, rePassword } = values;

        // Check if passwords match
        if (newPassword !== rePassword) {
            message.error("Passwords do not match!");
            return;
        }
        const res = await updatePassword(email, code, newPassword);
        if (res.data.data) {
            message.success(res.data.message);
            navigate('/login');
        } else {
            message.error("Something went wrong, please try again")
        }



    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f4f4f4'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#fff',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <h1 style={{ textAlign: 'center' }}>Reset Password</h1>
                <Form
                    onFinish={handleSubmit}
                    initialValues={{
                        newPassword: '',
                        rePassword: '',
                    }}
                    layout="vertical"
                    labelCol={{ span: 24 }} // Full width for labels
                    wrapperCol={{ span: 24 }} // Full width for inputs
                    style={{ marginTop: '20px' }}
                >
                    {/* New Password */}
                    <Form.Item
                        label="New Password"
                        name="newPassword"
                        rules={[
                            { required: true, message: "Please input your new password!" },
                            { min: 6, message: "Password must be at least 6 characters" },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    {/* Re-enter New Password */}
                    <Form.Item
                        label="Re-enter Password"
                        name="rePassword"
                        rules={[
                            { required: true, message: "Please re-enter your new password!" },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
                        <Button type="primary" htmlType="submit"
                            style={{
                                width: 130,
                                height: 50,
                                backgroundColor: 'black',
                                color: 'white',
                                borderRadius: 2
                            }}
                        >
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div >
    );
};

export default ResetPassword;
