import { Button, Input, Modal, notification } from "antd"
import { useState } from "react"
import { createCategoryAPI } from "../../service/api.service"


const CategoryForm = (props) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [name, setName] = useState("")

    const { loadCategory } = props

    const handleSubmit = async () => {
        const res = await createCategoryAPI(name)
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
        setName("")
        setIsModalOpen(false)
    }
    return (
        <>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
                Create category
            </Button>
            <Modal
                title="Create category"
                open={isModalOpen}
                onOk={handleSubmit}
                onCancel={() => resetModal()}
                okText={"save"}
            >
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
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
export default CategoryForm