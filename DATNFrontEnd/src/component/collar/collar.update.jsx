import { Form, Input, Modal, notification, Select } from "antd"; // Thêm Select vào import
import { useEffect } from "react";
import { updateCollarAPI } from "../../service/api.service";

const ColorUpdate = (props) => {
    const { loadCollar, idModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate } = props;
    const [form] = Form.useForm(); // Khởi tạo form

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
        const res = await updateCollarAPI(values.id, values.code, values.name, values.status); // Lấy giá trị từ form
        if (res.data) {
            notification.success({
                message: "Update collar",
                description: "Update collar successfully",
            });
            await loadCollar();
            resetModal();
        }
    };

    const resetModal = () => {
        setDataUpdate("");
        setIsModalUpdateOpen(false);
    };

    return (
        <Modal
            title="Chỉnh sửa cổ áo"
            open={idModalUpdateOpen}
            onOk={() => { form.submit(); }} // Gọi submit của form
            onCancel={() => resetModal()}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit} // Gọi hàm handleSubmit khi submit form
            >
                <Form.Item
                    label="ID"
                    name="id"
                >
                    <Input disabled /> {/* ID không thể chỉnh sửa */}
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
