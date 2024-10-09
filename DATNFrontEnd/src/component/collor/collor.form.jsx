import { Button, Input, Modal, notification } from "antd"
import { useState } from "react"
import { createColorAPI } from "../../service/api.service"


const ColorForm = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [status, setStatus] = useState("")

    const { loadColor } = props

    const handleSubmit = async () => {
        const res = await createColorAPI(code, name, status)
        if (res.data) {
            notification.success({
                message: "create color",
                description: "create color successfully"
            })
            await loadColor()
            resetModal()
        }
    }
    const resetModal = () => {
        setCode("")
        setName("")
        setStatus("")
        setIsModalOpen(false)
    }
    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Create color
            </Button>
            <Modal
                title="Create color"
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={() => resetModal()}
                okText={"save"}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <span>Code</span>
                        <Input
                            onChange={(event) => { setCode(event.target.value) }}
                        />
                    </div>

                    <div>
                        <span>Name</span>
                        <Input
                            onChange={(event) => { setName(event.target.value) }}
                        />
                    </div>
                </div>
            </Modal>
        </>

    )

}
export default ColorForm