import { Button, notification, Popconfirm, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import ColorUpdate from "./collar.update";
import { deleteCollarAPI } from "../../service/api.service";


const CollarTable = (props) => {
    const { dataCollar, loadCollar } = props
    const [idModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
    const [dataUpdate, setDataUpdate] = useState("")


    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: 'Mã',
            dataIndex: 'code',
        },
        {
            title: 'Tên',
            dataIndex: 'name',
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            render: (status) => {
                return status === 1 ? 'Đang hoạt động' : 'Ngưng hoạt động';
            },
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_, record) => {
                return (
                    <Button
                        icon={<EditOutlined />}
                        style={{ cursor: "pointer", color: "orange" }}
                        onClick={() => {
                            setIsModalUpdateOpen(true)
                            setDataUpdate(record)
                        }}
                    >Edit</Button>
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