import { Button, Form, Input, Modal, notification } from "antd"
import { useState } from "react"
import { createBrandAPI } from "../../service/api.service"


const BrandForm = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form] = Form.useForm();

    const { loadBrand, listCode, listName } = props

    const handleSubmit = async (values) => {
        const res = await createBrandAPI(values.code, values.name, values.status)
        if (res.data) {
            notification.success({
                message: "create brand",
                description: "create brand successfully"
            })
            await loadBrand()
            resetModal()
        }
    }
    const resetModal = () => {
        form.resetFields()
        setIsModalOpen(false)
    }
    const checkDuplicateCode = (rule, value) => {
        if (listCode.includes(value)) {
            return Promise.reject(new Error("Code already exists"))
        }
        return Promise.resolve();
    }
    const checkDuplicateName = (rule, value) => {
        if (listName.includes(value)) {
            return Promise.reject(new Error("Name already exists"))
        }
        return Promise.resolve();
    }
    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Create brand
            </Button>
            <Modal
                title="Create brand"
                open={isModalOpen}
                onOk={() => { form.submit() }}
                onCancel={() => resetModal()}
                okText={"save"}
            >
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    layout="vertical"
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
export default BrandForm