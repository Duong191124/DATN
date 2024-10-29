import { Form, Input, Modal, notification, Select } from "antd"; // Import Select
import { useEffect } from "react";
import { updateColorAPI } from "../../service/api.service";

const ColorUpdate = (props) => {
    const [form] = Form.useForm();

    const { loadColor, idModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate } = props;

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                id: dataUpdate.id,
                code: dataUpdate.code,
                name: dataUpdate.name,
                status: dataUpdate.status,
            });
        }
    }, [dataUpdate, form]);

    const handleSubmit = async (values) => {
        const res = await updateColorAPI(values.id, values.code, values.name, values.status);
        if (res.data) {
            notification.success({
                message: "Update Color",
                description: "Update color successfully",
            });
            await loadColor();
            resetModal();
        }
    };

    const resetModal = () => {
        setDataUpdate("");
        setIsModalUpdateOpen(false);
    };

    return (
        <Modal
            title="Chỉnh sửa màu sắc"
            open={idModalUpdateOpen}
            onOk={() => { form.submit(); }}
            onCancel={() => resetModal()}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="ID"
                    name="id"
                    rules={[
                        {
                            required: true,
                            message: 'ID cannot be empty',
                        },
                    ]}
                >
                    <Input disabled />
                </Form.Item>

                <Form.Item
                    label="Code"
                    name="code"
                    rules={[
                        {
                            required: true,
                            message: 'Code cannot be empty',
                        },
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
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="status"
                    rules={[
                        {
                            required: true,
                            message: 'Status cannot be empty',
                        },
                    ]}
                >
                    <Select placeholder="Chọn trạng thái" style={{ width: '100%' }}>
                        <Select.Option value={1}>Đang hoạt động</Select.Option>
                        <Select.Option value={0}>Ngưng hoạt động</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ColorUpdate;
