import { Button, Form, Input, Modal, notification } from "antd"
import { createWeightAPI } from "../../service/api.service"
import { useState } from "react"


const WeightForm = (props) => {
    const [form] = Form.useForm()
    const { loadDataWeight } = props
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleSubmit = async (values) => {
        const res = await createWeightAPI(values.code, values.name, values.status);
        if (res.data) {
            notification.success({
                message: "create weight",
                description: "Create weight successfully"
            })
            loadDataWeight();
            resetModal();
        } else {
            notification.error({
                message: "Create weight",
                description: JSON.stringify(res.message)
            })
        }
    }
    const resetModal = () => {
        form.resetFields()
        setIsModalOpen(false)
    }
    return (

        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Create Weight
            </Button>
            <Modal
                title="Basic Modal"
                open={isModalOpen}
                onOk={() => form.submit()}
                onCancel={() => resetModal()}
            >
                <Form
                    onFinish={handleSubmit}
                    form={form}
                >
                    <Form.Item
                        label="Code"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your username!',
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
                                message: 'Please input your password!',
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
export default WeightForm