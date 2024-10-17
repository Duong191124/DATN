import { Button, Form, Input, Modal, notification } from "antd"
import { useState } from "react"
import { createSleeveAPI } from "../../service/api.service"


const SleeveForm = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form] = Form.useForm()

    const { loadSleeve, listSleeveName, listSleeveCode } = props

    const handleSubmit = async (values) => {
        const res = await createSleeveAPI(values.code, values.name, values.status)
        if (res.data) {
            notification.success({
                message: "create sleeve",
                description: "create sleeve successfully"
            })
            await loadSleeve()
            resetModal()
        } else {
            notification.error({
                message: "create sleeve",
                description: JSON.stringify(res.message)
            })
        }
    }
    const resetModal = () => {
        setIsModalOpen(false)
        form.resetFields()
    }
    const checkDuplicateCode = (rules, value) => {
        if (listSleeveCode.includes(value)) {
            return Promise.reject(new Error('code already exists'))
        }
        return Promise.resolve();
    }
    const checkDuplicateName = (rules, value) => {
        if (listSleeveName.includes(value)) {
            return Promise.reject(new Error('Name already exists'))
        }
        return Promise.resolve();
    }

    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Create sleeve
            </Button>
            <Modal
                title="Create sleeve"
                open={isModalOpen}
                onOk={() => { form.submit() }}
                onCancel={() => resetModal()}
                okText="save"
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
export default SleeveForm