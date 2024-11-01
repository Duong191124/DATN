import { Button, notification, Popconfirm, Table } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import ColorUpdate from "./brand.update";
import { deleteBrandAPI } from "../../service/api.service";


const BrandTable = (props) => {
    const { dataBrand, loadBrand } = props
    const [idModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
    const [dataUpdate, setDataUpdate] = useState("")


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
                    <Button
                        icon={<EditOutlined />}
                        style={{ cursor: "pointer", color: "orange" }}
                        onClick={() => {
                            setIsModalUpdateOpen(true)
                            setDataUpdate(record)
                        }}
                    >Edit Brand</Button>
                )
            }
        }
    ];
    return (
        <>
            <Table dataSource={dataBrand} columns={columns} />
            <ColorUpdate
                idModalUpdateOpen={idModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                loadBrand={loadBrand}
            />
        </>
    )
}
export default BrandTable