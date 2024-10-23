import { Button, Form, Input, Modal, notification } from "antd"
import { useState } from "react"
import { createCategoryAPI } from "../../service/api.service"


const CategoryForm = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form] = Form.useForm()

    const { loadCategory } = props

    const handleSubmit = async (values) => {
        const res = await createCategoryAPI(values.name)
        if (res.data) {
            notification.success({
                message: "create category",
                description: "create category successfully"
            })
            await loadCategory()
            resetModal()
        }
    }
    const resetModal = () => {
        setIsModalOpen(false)
        form.resetFields
    }
    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Create category
            </Button>
            <Modal
                title="Create category"
                open={isModalOpen}
                onOk={() => { form.submit() }}
                onCancel={() => resetModal()}
                okText={"save"}
            >
                <Form
                    onFinish={handleSubmit}
                    layout="vertical"
                    form={form}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
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
export default CategoryForm