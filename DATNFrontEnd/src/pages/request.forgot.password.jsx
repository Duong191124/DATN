import React, { useState } from "react";
import { Form, Input, Button, message, Result } from "antd";
import { requetsForgotPassword } from "../service/api.service";

const RequestForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); // State to track submission
    const [error, setError] = useState(false); // State to track error

    // Handle forgot password request submission
    const handleSubmit = async () => {
        setLoading(true);
        try {
            await requetsForgotPassword(email);
            setLoading(false);
            setIsSubmitted(true); // Update the state to show the success message
        } catch (error) {
            setLoading(false);
            setError(true); // If an error occurs, set error state to true
            message.error("Failed to send the email. Please try again.");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor: "#f0f2f5",
            }}
        >
            {isSubmitted ? (
                // Display the success message as a fixed screen when submission is successful
                <div
                    style={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "2px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        width: "400px",
                        textAlign: "center",
                    }}
                >
                    <Result
                        status="success"
                        title="Please check your email"
                        subTitle="We have sent you a link to reset your password."
                        icon={<i className="anticon anticon-check-circle" style={{ fontSize: "32px", color: "#52c41a" }} />}
                    />
                </div>
            ) : (
                // Display the initial form to enter email
                <div
                    style={{
                        backgroundColor: "white",
                        padding: "30px",
                        borderRadius: "2px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                        width: "400px",
                        textAlign: "center",
                    }}
                >
                    <h2>Forgot Password</h2>
                    <Form onFinish={handleSubmit} layout="vertical" style={{ textAlign: 'center' }}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ required: true, message: "Please enter your email!" }]}
                        >
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary" htmlType="submit" loading={loading}
                                style={{
                                    width: 130,
                                    height: 50,
                                    backgroundColor: 'black',
                                    color: 'white',
                                    borderRadius: 2,
                                    alignItems: 'center'
                                }}
                            >
                                Send request
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </div>
    );
};

export default RequestForgotPassword;
