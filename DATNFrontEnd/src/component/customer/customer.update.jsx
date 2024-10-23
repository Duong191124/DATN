import { Modal, Form, Input, Button, DatePicker, Select, message } from 'antd';
import { useForm } from "antd/es/form/Form";
import { useEffect } from 'react';
import moment from 'moment'; // Đảm bảo import moment
import { updateCustomer } from '../../service/api.service';

const CustomerUpdate = ({ isModalOpen, setIsModalOpen, loadData, dataDetail }) => {
    const { Option } = Select;

    // Hook của form
    const [myForm] = useForm();

    // Hàm lưu dữ liệu
    const handleSave = () => {
        myForm.submit();
    };

    // Hàm hủy modal
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Hàm xử lý form
    const onFinish = async (values) => {
        console.log('Success:', values);
        await updateCustomer(
            dataDetail.id,
            values.username,
            values.password,
            values.email,
            values.address,
            values.phone,
            values.status,
            values.dob,
            values.name,
            values.note,
            values.gender
        );
        myForm.resetFields();
        loadData();
        message.success("Update success");
        setIsModalOpen(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    // Gán giá trị từ dataDetail vào form khi modal mở
    useEffect(() => {
        if (isModalOpen && dataDetail) {
            myForm.setFieldsValue({
                username: dataDetail.username,
                password: dataDetail.password, // có thể bỏ qua nếu không cần hiển thị
                email: dataDetail.email,
                address: dataDetail.address,
                phone: dataDetail.phoneNumber,
                dob: moment(dataDetail.dateOfBirth), // Cần định dạng với moment
                name: dataDetail.name,
                note: dataDetail.notes,
                gender: dataDetail.gender ? String(dataDetail.gender) : undefined, // Đảm bảo giá trị là chuỗi
                status: dataDetail.status === 1 ? '1' : '0', // Đặt giá trị cho status
            });
        }
        console.log("check data detail: ", dataDetail)
    }, [isModalOpen, dataDetail]);

    return (
        <>
            <Modal
                title="Update staff"
                open={isModalOpen}
                footer={null}  // Ẩn các nút mặc định
                onCancel={handleCancel}
            >
                <Form
                    form={myForm}
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout='vertical'
                >
                    {/* User name */}
                    <Form.Item
                        label="User name"
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input username!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Password */}
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input password!',
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    {/* Email */}
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: 'The input is not valid email!',
                            },
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Address */}
                    <Form.Item
                        label="Address"
                        name="address"
                    >
                        <Input />
                    </Form.Item>

                    {/* Phone */}
                    <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: 'Please input phone number!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Date of Birth */}
                    <Form.Item
                        label="Date of birth"
                        name="dob"
                        rules={[
                            {
                                required: true,
                                message: 'Please select date of birth!',
                            },
                        ]}
                    >
                        <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>

                    {/* Name */}
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input name!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Note */}
                    <Form.Item
                        label="Note"
                        name="note"
                    >
                        <Input.TextArea />
                    </Form.Item>

                    {/* Gender */}
                    <Form.Item
                        label="Gender"
                        name="gender"
                        rules={[
                            {
                                required: true,
                                message: 'Please select gender!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select gender"
                        >
                            <Option value="1">Male</Option>
                            <Option value="2">Female</Option>
                            <Option value="3">Other</Option>
                        </Select>
                    </Form.Item>

                    {/* Status Dropdown */}
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[
                            {
                                required: true,
                                message: 'Please select status!',
                            },
                        ]}
                    >
                        <Select
                            placeholder="Select status"
                        >
                            <Option value="1">Active</Option>
                            <Option value="0">Inactive</Option>
                        </Select>
                    </Form.Item>

                    {/* Nút Save */}
                    <Button type="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default CustomerUpdate;
