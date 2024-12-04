import { Button, Form, Input, Row, Col, Divider, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { getUserInfo, loginCustomerAPI } from "../service/api.service";
import { AuthContext } from "../component/context/auth.context";
import { useCart } from "../component/context/cart.context";

const LoginPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUser, setLoginStatus } = useContext(AuthContext);
    const { setCartItems } = useCart();

    const handleLogin = async (values) => {
        setLoading(true);
        try {
            const res = await loginCustomerAPI(values.username, values.password);

            if (res.status === 200 || res.status === 201) {
                localStorage.setItem("access_token", res.data.token);

                const userInfoRes = await getUserInfo(res.data.token);
                if (userInfoRes.status === 200) {
                    localStorage.setItem("userId", userInfoRes.data.data.id);
                    const userCart = JSON.parse(localStorage.getItem(`cart_${userInfoRes.data.data.id}`)) || [];
                    setCartItems(userCart);
                    setUser(userInfoRes.data.data);
                    setLoginStatus(res.status.toString());
                    message.success("Đăng nhập thành công");
                    navigate(res.status === 200 ? "/" : "/admin");
                }
            }
            setLoading(false);
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
                console.error(error);
            }
            setLoading(false);
        }
    };

    const onFinish = (values) => {
        handleLogin(values);
    };

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
                                    message: 'username không được để trống!',
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
                    <div
                        style={{
                            textAlign: 'center'
                        }}
                    >
                        <Link
                            to={"/forgot-password"}
                            style={{
                                color: 'blue'
                            }}
                        >
                            Forgot password</Link>
                    </div>
                </fieldset>
            </Col>
        </Row>

    )
}

export default LoginPage;