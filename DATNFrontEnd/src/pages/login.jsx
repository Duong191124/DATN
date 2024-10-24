import { Button, Form, Input, Row, Col, Divider, message, notification } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { loginCustomerAPI } from "../service/api.service";
import { AuthContext } from "../component/context/auth.context";

const LoginPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);


    const onFinish = async (values) => {
        setLoading(true)
        try {
            const res = await loginCustomerAPI(values.username, values.password);
            console.log(res);
            if (res.status === 200 || res.status === 201) {
                localStorage.setItem("access_token", res.data.token);
                // setUser(res.data.user)
                // setStatus(res.status);
                message.success("Đăng nhập thành công");
                if (res.status === 200) {
                    navigate("/");
                } else {
                    navigate("/admin");
                }
            }
            setLoading(false)
        } catch (error) {
            if (error.response && error.response.status === 401) {
                form.setFields([
                    {
                        name: "username",
                        errors: ["Username or password is not valid"],
                    },
                    {
                        name: "password",
                        errors: ["Username or password is not valid"],
                    },
                ]);
            } else {
                message.error("Đăng nhập thất bại, vui lòng thử lại.");
            }
            setLoading(false);
        }
    }

    return (
        <Row justify={"center"} style={{ marginTop: "30px" }}>
            <Col xs={24} md={16} lg={8}>
                <fieldset style={{
                    padding: "15px",
                    margin: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px"
                }}>
                    <legend>Đăng Nhập</legend>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                    >
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: 'Email không được để trống!',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: 'Password không được để trống!',
                                },
                            ]}
                        >
                            <Input.Password onKeyDown={(event) => {
                                if (event.key === 'Enter') form.submit()
                            }} />
                        </Form.Item>

                        <Form.Item >
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Button
                                    loading={loading}
                                    type="primary" style={{ width: "150px" }} onClick={() => form.submit()}>
                                    Login
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                    <Divider />
                    <div style={{ textAlign: "center" }}>
                        Chưa có tài khoản? <Link to={"/register"}>Đăng ký tại đây</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>

    )
}

export default LoginPage;