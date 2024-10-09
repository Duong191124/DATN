import { Button, Input, Modal, notification } from "antd"
import { useState } from "react"
import { createBrandAPI } from "../../service/api.service"


const BrandForm = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [status, setStatus] = useState("")

    const { loadBrand } = props

    const handleSubmit = async () => {
        const res = await createBrandAPI(code, name, status)
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
        setCode("")
        setName("")
        setStatus("")
        setIsModalOpen(false)
    }
    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Create brand
            </Button>
            <Modal
                title="Create brand"
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
export default BrandForm