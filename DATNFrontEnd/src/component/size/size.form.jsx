import { Button, Form, Input, Modal, notification } from "antd"
import { useState } from "react"
import { createSizeAPI, checkDuplicateSizeAPI } from "../../service/api.service"

const SizeForm = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { loadSize } = props
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        const res = await createSizeAPI(values.code, values.name, values.status)
        if (res.data) {
            notification.success({
                message: "Create Size",
                description: "Create size successfully"
            })
            await loadSize()
            resetModal()
        }
    }

    const resetModal = () => {
        form.resetFields()
        setIsModalOpen(false)
    }

    const checkDuplicateCode = async (rules, value) => {
        try {
            const res = await checkDuplicateSizeAPI('code', value)
            if (res.data.exists) {
                return Promise.reject(new Error('Code already exists'))
            }
            return Promise.resolve()
        } catch (error) {
            return Promise.reject(new Error('Failed to validate code'))
        }
    }

    const checkDuplicateName = async (rules, value) => {
        try {
            const res = await checkDuplicateSizeAPI('name', value)
            if (res.data.exists) {
                return Promise.reject(new Error('Name already exists'))
            }
            return Promise.resolve()
        } catch (error) {
            return Promise.reject(new Error('Failed to validate name'))
        }
    }

    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Create Size
            </Button>
            <Modal
                title="Create Size"
                open={isModalOpen}
                onOk={() => { form.submit() }}
                onCancel={() => resetModal()}
                okText="Save"
            >
                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
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

export default SizeForm
