import { Input, Modal, notification } from "antd"
import { useEffect, useState } from "react"
import { updateCategoryAPI } from "../../service/api.service"


const ColorUpdate = (props) => {
    const [id, setId] = useState("")
    const [name, setName] = useState("")

    const { loadCategory, idModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate } = props
    useEffect(() => {
        if (dataUpdate) {
            setId(dataUpdate.id)
            setName(dataUpdate.name)
        }
    }, [dataUpdate])

    const handleSubmit = async () => {
        const res = await updateCategoryAPI(id, name)
        if (res.data) {
            notification.success({
                message: "update collar",
                description: "update collar successfully"
            })
            await loadCategory()
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
                onOk={handleSubmit}
                onCancel={() => resetModal()}>


                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

                    <div>
                        <span>ID</span>
                        <Input
                            value={id}
                            disabled
                            onChange={(event) => { setId(event.target.value) }}
                        />
                    </div>
                    <div>
                        <span>Name</span>
                        <Input
                            value={name}
                            onChange={(event) => { setName(event.target.value) }}
                        />
                    </div>
                </div>
            </Modal>
        </>

    )

}
export default ColorUpdate