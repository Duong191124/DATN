import { Button, Input, Form, notification, DatePicker, Row, Col, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomerAPI } from "../service/api.service";
import { useState } from "react";


const RegisterPage = () => {
    const [form] = Form.useForm();
    const [usernameError, setUsernameError] = useState("");
    const navigate = useNavigate();

    const onFinish = async (values) => {
        setUsernameError(""); // Reset the username error message before new submission

        try {
            // Call the API
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
                    message: "Register user",
                    description: "Đăng ký user thành công"
                });
                navigate("/login");
            }
        } catch (error) {
            if (error.response && error.response.status === 406 && error.response.data.message.includes("Username has been taken")) {
                setUsernameError("Username has been taken");
            } else {
                notification.error({
                    message: "Register user error",
                    description: JSON.stringify(error.message)
                });
            }
        }
    }



    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ margin: "30px" }}
        >
            <h3 style={{ textAlign: "center" }}>Đăng ký tài khoản</h3>
            <Row justify={"center"}>
                <Col xs={24} md={8} >
                    <Form.Item
                        label="Username"
                        name="username"
                        validateStatus={usernameError ? "error" : ""}
                        help={usernameError}
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify={"center"}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify={"center"}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Confirm Password"
                        name="confirm_password"
                        dependencies={['password']}
                        hasFeedback={false}
                        validateTrigger="onBlur"
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password!',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password onBlur={() => form.validateFields(['confirm_password'])} />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify={"center"}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Phone number"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                pattern: new RegExp(/\d+/g),
                                message: "Wrong format!"
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify={"center"}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                            {
                                type: "email",
                                message: 'Email không đúng định dạng!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify={"center"}>
                <Col xs={24} md={8}>
                    <Form.Item
                        label="Date of birth"
                        name="dateOfBirth"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your date of birth!',
                            },
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>
                </Col>
            </Row>

            <Row justify={"center"}>
                <Col xs={24} md={8}>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <Button
                            style={{ width: "100%" }}
                            onClick={() => form.submit()}
                            type="primary">Register</Button>
                    </div>
                    <Divider />
                    <div style={{ textAlign: "center" }}>Đã có tài khoản? <Link to={"/login"}>Đăng nhập tại đây</Link></div>
                </Col>
            </Row>

        </Form >

    )
}

export default RegisterPage;