import { Button, Form, Input, Modal, notification } from "antd"
import { useState } from "react"
import { createCollarAPI } from "../../service/api.service"


const CollarForm = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form] = Form.useForm();

    const { loadCollar, listCollarName, listCollarCode } = props

    const handleSubmit = async (values) => {
        const res = await createCollarAPI(values.code, values.name, values.status)
        if (res.data) {
            notification.success({
                message: "create collar",
                description: "create collar successfully"
            })
            await loadCollar()
            resetModal()
        }
    }
    const resetModal = () => {
        form.resetFields
        setIsModalOpen(false)
    }
    const checkDuplicateCode = (rules, value) => {
        if (listCollarCode.includes(value)) {
            return Promise.reject(new Error('code already exists'))
        }
        return Promise.resolve();
    }
    const checkDuplicateName = (rules, value) => {
        if (listCollarName.includes(value)) {
            return Promise.reject(new Error('name already exists'))
        }
        return Promise.resolve();
    }
    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Create collar
            </Button>
            <Modal
                title="Create collar"
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
                        label="Code"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: 'Code cannot be empty',
                            },
                            {
                                validator: checkDuplicateCode
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
                                validator: checkDuplicateName
                            }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>

    )

}
export default CollarForm