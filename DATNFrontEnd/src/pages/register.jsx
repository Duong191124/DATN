import { Button, Input, Form, notification, DatePicker, Row, Col, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomerAPI } from "../service/api.service";


const RegisterPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        //call api
        const res = await registerCustomerAPI(
            values.username,
            values.password,
            values.confirm_password,
            values.phone,
            values.email,
            values.dateOfBirth
        );

        console.log(res);

        if (res.data) {
            notification.success({
                message: "Register user",
                description: "Đăng ký user thành công"
            });
            navigate("/login");
        } else {
            notification.error({
                message: "Register user error",
                description: JSON.stringify(res.message)
            })
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
                        rules={[
                            {
                                required: true,
                                message: 'Please input your confirm password!',
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