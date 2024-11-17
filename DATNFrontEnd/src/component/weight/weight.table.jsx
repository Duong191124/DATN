import { Button, Table } from "antd";
import { render } from "react-dom";
import WeightUpdate from "./weight.update";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";

const WeightTable = (props) => {
    const { dataWeight, loadDataWeight } = props
    const [dataUpdate, setDataUpdate] = useState([])
    const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false)
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',

        },
        {
            title: 'weight',
            dataIndex: 'weightValue',

        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                return status === 1 ? "Dang Hoat Dong" : "Ngung Hoat Dong"
            }

        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => {
                return (
                    <div style={{ display: "flex", gap: "20px" }}>

                        <Button
                            icon={<EditOutlined />}
                            style={{ cursor: "pointer", color: "orange" }}
                            onClick={() => {
                                setIsModalUpdateOpen(true)
                                setDataUpdate(record)
                            }}
                        >
                            Edit
                        </Button>
                    </div>
                )
            }
        }

    ];


    return (
        <>
            <Table dataSource={dataWeight} columns={columns} />
            <WeightUpdate
                loadDataWeight={loadDataWeight}
                dataUpdate={dataUpdate}
                setDataUpdate={setDataUpdate}
                isModalUpdateOpen={isModalUpdateOpen}
                setIsModalUpdateOpen={setIsModalUpdateOpen}
            />
        </>
    )
}
export default WeightTable