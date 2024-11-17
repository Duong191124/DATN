import { message, Modal } from "antd";
import React, { useEffect } from "react";
import { Button, Form, Input } from 'antd';
import { useForm } from "antd/es/form/Form";
import { createNewPermission, updatePermissionById } from "../../service/api.service";

const PermissionUpdate = ({ isOpenUpdate, setIsOpenUpdate, loadData, isUpdate }) => {
    // Sử dụng hook của form
    const [myForm] = useForm();

    // Khi nhận được giá trị mới từ isUpdate, reset form với dữ liệu của isUpdate
    useEffect(() => {
        if (isUpdate) {
            myForm.setFieldsValue({
                name: isUpdate.name, // Gán giá trị name từ isUpdate vào form
            });
        } else {
            myForm.resetFields(); // Reset form khi không có dữ liệu cần update
        }
    }, [isUpdate, myForm]);

    // Hàm xử lý khi bấm OK
    const handleOk = () => {
        setIsOpenUpdate(false);
        myForm.submit(); // Gửi form khi bấm OK
    };

    // Hàm xử lý khi bấm Cancel
    const handleCancel = () => {
        setIsOpenUpdate(false);
    };

    // Xử lý form khi submit thành công
    const onFinish = async (values) => {
        await updatePermissionById(isUpdate.id, values.name);
        myForm.resetFields(); // Reset form sau khi tạo mới
        loadData(); // Tải lại dữ liệu sau khi hoàn tất cập nhật
        message.success("update success")
    };

    // Xử lý form khi submit thất bại
    const onFinishFailed = (errorInfo) => {
        console.error('Failed:', errorInfo);
    };

    return (
        <>
            <Modal
                title="Update Permission"
                open={isOpenUpdate}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    form={myForm}
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input name permission!',
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default PermissionUpdate;
