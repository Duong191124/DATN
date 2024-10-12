import { Button, Form, Input, Modal, notification } from "antd";
import { useState } from "react";
import { createColorAPI } from "../../service/api.service";

const ColorForm = (props) => {
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { loadColor, listName, listCode } = props;

    const resetModal = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        const res = await createColorAPI(values.code, values.name, values.status);
        if (res.data) {
            notification.success({
                message: "Create Color",
                description: "Create color successfully",
            });
            await loadColor();
            resetModal();
        } else {
            notification.error({
                message: "Create Color",
                description: JSON.stringify(res.message),
            });
        }
    };

    const checkDuplicateName = (rule, value) => {
        if (listName.includes(value)) {
            return Promise.reject(new Error('Name already exists'));
        }
        return Promise.resolve();

    };


    const checkDuplicateCode = (rule, value) => {
        if (listCode.includes(value)) {
            return Promise.reject(new Error('Code already exists'));
        }
        return Promise.resolve();
    };

    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Create Color
            </Button>
            <Modal
                title="Create Color"
                open={isModalOpen}
                onOk={() => { form.submit(); }}
                onCancel={resetModal}
                okText={"Save"}
            >
                <Form
                    layout="vertical"
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Code"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: 'Code cannot be empty',
                            },
                            {
                                validator: checkDuplicateCode,
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Name cannot be empty',
                            },
                            {
                                validator: checkDuplicateName,
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

export default ColorForm;
