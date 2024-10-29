import { Form, Input, Modal, notification, Select } from "antd"; // Import Select
import { useEffect } from "react";
import { updateSleeveAPI } from "../../service/api.service";

const SizeUpdate = (props) => {
    const [form] = Form.useForm(); // Tạo form sử dụng Ant Design

    const { loadSleeve, idModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate } = props;

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
        const res = await updateSleeveAPI(values.id, values.code, values.name, values.status);
        if (res.data) {
            notification.success({
                message: "Cập nhật tay áo",
                description: "Cập nhật tay áo thành công"
            });
            await loadSleeve();
            resetModal();
        }
    };

    const resetModal = () => {
        setDataUpdate(null);
        setIsModalUpdateOpen(false);
    };

    return (
        <Modal
            title="Chỉnh sửa tay áo"
            open={idModalUpdateOpen}
            onOk={() => { form.submit(); }}
            onCancel={() => resetModal()}
            okText="Lưu"
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
                            message: 'ID không được để trống',
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
                            message: 'Code không được để trống',
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
                            message: 'Name không được để trống',
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
                            message: 'Status không được để trống',
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

export default SizeUpdate;
