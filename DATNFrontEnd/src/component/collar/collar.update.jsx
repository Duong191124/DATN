import { Input, Modal, notification } from "antd"
import { useEffect, useState } from "react"
import { updateCollarAPI, updateColorAPI } from "../../service/api.service"


const ColorUpdate = (props) => {
    const [id, setId] = useState("")
    const [code, setCode] = useState("")
    const [name, setName] = useState("")
    const [status, setStatus] = useState("")

    const { loadCollar, idModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, setDataUpdate } = props
    useEffect(() => {
        if (dataUpdate) {
            setId(dataUpdate.id)
            setCode(dataUpdate.code)
            setName(dataUpdate.name)
            setStatus(dataUpdate.status)
        }
    }, [dataUpdate])

    const handleSubmit = async () => {
        const res = await updateCollarAPI(id, code, name, status)
        if (res.data) {
            notification.success({
                message: "update collar",
                description: "update collar successfully"
            })
            await loadCollar()
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
                        <span>Code</span>
                        <Input
                            value={code}
                            onChange={(event) => { setCode(event.target.value) }}
                        />
                    </div>

                    <div>
                        <span>Name</span>
                        <Input
                            value={name}
                            onChange={(event) => { setName(event.target.value) }}
                        />
                    </div>

                    <div>
                        <span>Status</span>
                        <Input
                            value={status}
                            onChange={(event) => { setStatus(event.target.value) }}
                        />
                    </div>
                </div>
            </Modal>
        </>

    )

}
export default ColorUpdate