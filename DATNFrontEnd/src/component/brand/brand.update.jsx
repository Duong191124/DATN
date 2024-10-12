import { Form, Input, Modal, notification } from "antd"
import { useEffect } from "react"
import { updateBrandAPI } from "../../service/api.service"


const ColorUpdate = (props) => {
    const { loadBrand, idModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate } = props
    const [form] = Form.useForm();
    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                id: dataUpdate.id,
                code: dataUpdate.code,
                name: dataUpdate.name,
                status: dataUpdate.status
            })

        }
    }, [dataUpdate, form])

    const handleSubmit = async (values) => {
        const res = await updateBrandAPI(values.id, values.code, values.name, values.status)
        if (res.data) {
            notification.success({
                message: "update collar",
                description: "update collar successfully"
            })
            await loadBrand()
            resetModal()
        }
    }
    const resetModal = () => {
        setDataUpdate("")
        setIsModalUpdateOpen(false)
    }
    return (
        <>

            <Modal
                title="Basic Modal"
                open={idModalUpdateOpen}
                onOk={() => { form.submit() }}
                onCancel={() => resetModal()}>


                <Form

                    onFinish={handleSubmit}
                    layout="vertical"
                    form={form}
                >
                    <Form.Item
                        label="ID"
                        name="id"

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
        </>

    )

}
export default ColorUpdate