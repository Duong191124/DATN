import { Form, Input, Modal, notification } from "antd"; // Thêm Form vào import
import { useEffect } from "react";
import { updateCategoryAPI } from "../../service/api.service";

const ColorUpdate = (props) => {
    const { loadCategory, idModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate } = props;
    const [form] = Form.useForm(); // Khởi tạo form

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                id: dataUpdate.id,
                name: dataUpdate.name,
            });
        }
    }, [dataUpdate, form]);

    const handleSubmit = async (values) => {
        const res = await updateCategoryAPI(values.id, values.name); // Lấy giá trị từ form
        if (res.data) {
            notification.success({
                message: "Update category",
                description: "Update category successfully",
            });
            await loadCategory();
            resetModal();
        }
    };

    const resetModal = () => {
        setDataUpdate("");
        setIsModalUpdateOpen(false);
    };

    return (
        <Modal
            title="Chỉnh sửa danh mục"
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
            </Form>
        </Modal>
    );
};

export default ColorUpdate;
