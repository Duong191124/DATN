import { Modal } from "antd"
import React, { useState } from "react"
import { Button, Checkbox, Form, Input } from 'antd';
import { useForm } from "antd/es/form/Form";
import { createNewPermission } from "../../service/api.service";
const PermissionModal = ({ isModalOpen, setIsModalOpen, loadData }) => {
    //hook of form
    const [myForm] = useForm();

    //function of modal
    const handleOk = () => {
        setIsModalOpen(false);
        myForm.submit();
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    //function of form
    const onFinish = async (values) => {
        console.log('Success:', values);
        await createNewPermission(values.name);
        myForm.resetFields();
        loadData();
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <>
            <Modal title="Create new permission" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
    )
}

export default PermissionModal