import { Modal, Form, Input, Button, DatePicker, Select, message } from 'antd';
import { useForm } from "antd/es/form/Form";
import { useEffect } from 'react';
import { createCustomer } from '../../service/api.service';

const CustomerCreate = ({ isModalOpen, setIsModalOpen, loadData })=>{
    const { Option } = Select;

    //hook of form
    const [myForm] = useForm();

    //function of modal
    const handleSave = () => {
        myForm.submit();
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    //function of form
    const onFinish = async (values) => {
        setIsModalOpen(false);
        console.log('Success:', values);
        await createCustomer(
            values.username,
            values.password,
            values.email,
            values.address,
            values.phone,
            values.dob,
            values.name,
            values.note,
            values.gender
            );
        myForm.resetFields();
        loadData();
        message.success("create success")
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    useEffect(()=>{

    }, [isModalOpen])

    return (
        <>
            <Modal 
            title="Create new customer" 
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
                {/* Id */}
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

                {/* Nút Save */}
                <Button type="primary" onClick={handleSave}>
                    Save
                </Button>
            </Form>
        </Modal>
        </>
    )
}

export default CustomerCreate