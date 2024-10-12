import { Form, Input, Modal, notification } from "antd"
import { useEffect } from "react"
import { updateColorAPI } from "../../service/api.service"


const ColorUpdate = (props) => {
    const [form] = Form.useForm()

    const { loadColor, idModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate } = props
    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                id: dataUpdate.id,
                code: dataUpdate.code,
                name: dataUpdate.name,
                status: dataUpdate.status,
            })

        }
    }, [dataUpdate, form])

    const handleSubmit = async (values) => {
        const res = await updateColorAPI(values.id, values.code, values.name, values.status)
        if (res.data) {
            notification.success({
                message: "update color",
                description: "update color successfully"
            })
            await loadColor()
            resetModal()
        }
    }
    const resetModal = () => {
        setDataUpdate("")
        setIsModalUpdateOpen(false)
    }
    return (
        <Modal
            title="Basic Modal"
            open={idModalUpdateOpen}
            onOk={() => { form.submit() }}
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
                    <Input />
                </Form.Item>

            </Form>

        </Modal>
    )

}
export default ColorUpdate