import { notification, Popconfirm, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import ColorUpdate from "./collar.update";
import { deleteCollarAPI } from "../../service/api.service";


const CollarTable = (props) => {
    const { dataCollar, loadCollar } = props
    const [idModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
    const [dataUpdate, setDataUpdate] = useState("")

    const deleteCollar = async (id) => {
        try {
            const res = await deleteCollarAPI(id);
            if (res.data) {
                notification.success({
                    message: "delete collar",
                    description: "delete collar successfully"
                })
                await loadCollar()
            }
        } catch (error) {
            if (error.response.status === 400) {
                notification.error({
                    message: "delete collar",
                    description: JSON.stringify(error.response.data)
                })
            }
        }
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Code',
            dataIndex: 'code',
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                return status === 1 ? 'Đang hoạt động' : 'Ngưng hoạt động';
            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "20px" }}>
                        <EditOutlined
                            style={{ cursor: "pointer", color: "orange" }}
                            onClick={() => {
                                setIsModalUpdateOpen(true)
                                setDataUpdate(record)
                            }}
                        />
                        <Popconfirm
                            title="Xoá sản phẩm"
                            description="bạn có chắc chắn muốn xoá sản phẩm này không ?"
                            onConfirm={() => { deleteCollar(record.id) }}
                            okText="yes"
                            cancelText="no"
                            placement="left"
                        >
                            <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
                        </Popconfirm>
                    </div>
                )
            }
        }
    ];
    return (
        <>
            <Table dataSource={dataCollar} columns={columns} />
            <ColorUpdate
                idModalUpdateOpen={idModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                loadCollar={loadCollar}
            />
        </>
    )
}
export default CollarTable