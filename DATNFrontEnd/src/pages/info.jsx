import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Row, Col, Card, Modal, message } from 'antd';
import moment from 'moment';

const { Option } = Select;

const InfoPage = () => {
    const [form] = Form.useForm(); // Sử dụng form từ antd

    // Khởi tạo state cho thông tin người dùng
    const [userInfo, setUserInfo] = useState({
        id: '',
        userName: '',
        email: '',
        address: '',
        phone: '',
        status: '',
        dateOfBirth: '',
        name: '',
        note: '',
        gender: '',
    });

    useEffect(() => {
        // Giả lập việc lấy thông tin người dùng từ API
        const fetchUserInfo = async () => {
            const data = await fetch('/api/user-info');
            const result = await data.json();
            setUserInfo(result); // Cập nhật state với dữ liệu từ API
            form.setFieldsValue({ ...result, dateOfBirth: moment(result.dateOfBirth) }); // Cập nhật form với giá trị từ state
        };

        fetchUserInfo();
    }, [form]);

    // Hàm submit form
    const onFinish = async (values) => {
        try {
            const response = await fetch('/api/update-user-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                message.success('Cập nhật thành công!');
            } else {
                message.error('Cập nhật thất bại!');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra trong quá trình cập nhật!');
        }
    };

    // Hàm xử lý khi nhấn nút submit, với xác nhận trước khi submit
    const handleSubmit = () => {
        Modal.confirm({
            title: 'Xác nhận cập nhật',
            content: 'Bạn có chắc chắn muốn cập nhật thông tin?',
            okText: 'Xác nhận',
            cancelText: 'Hủy',
            onOk: () => {
                form.submit(); // Submit form sau khi xác nhận
            },
        });
    };

    return (
        <div
            style={{
                marginTop: 100,
                marginBottom: 50
            }}
        >
            <Row justify="center" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
                <Col span={10}>
                    <Card
                        title="Thông tin người dùng"
                        bordered={false}
                        style={{
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            borderRadius: 1
                        }}>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={userInfo}
                        >
                            <Form.Item label="User name" name="userName" rules={[{ required: true, message: 'Vui lòng nhập User name!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Address" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Date of Birth" name="dateOfBirth" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}>
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>

                            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                                <Input />
                            </Form.Item>

                            <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}>
                                <Select placeholder="Chọn giới tính">
                                    <Option value="male">Nam</Option>
                                    <Option value="female">Nữ</Option>
                                    <Option value="other">Khác</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'black',
                                        color: 'white',
                                        height: 50
                                    }}
                                    onClick={handleSubmit} // Thêm sự kiện xác nhận trước khi submit
                                >
                                    Save information
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default InfoPage;
