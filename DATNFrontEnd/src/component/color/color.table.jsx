import { notification, Popconfirm, Table } from "antd";
import { deleteColorAPI } from "../../service/api.service";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import ColorUpdate from "./color.update";

const ColorTable = (props) => {
  const { dataColor, loadColor } = props;
  const [idModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [dataUpdate, setDataUpdate] = useState("");

  const deleteColor = async (id) => {
    try {
      const res = await deleteColorAPI(id);
      if (res.data) {
        notification.success({
          message: "delete color",
          description: "delete color successfully",
        });
        await loadColor();
      }
    } catch (error) {
      if (error.response.status === 400) {
        notification.error({
          message: "delete color",
          description: JSON.stringify(error.response.data)
        });
      }
    }
  };
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Code",
      dataIndex: "code",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        return status === 1 ? "Đang hoạt động" : "Ngưng hoạt động";
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        return (
          <div style={{ display: "flex", gap: "20px" }}>
            <EditOutlined
              style={{ cursor: "pointer", color: "orange" }}
              onClick={() => {
                setIsModalUpdateOpen(true);
                setDataUpdate(record);
              }}
            />
            <Popconfirm
              title="Xoá sản phẩm"
              description="bạn có chắc chắn muốn xoá sản phẩm này không ?"
              onConfirm={() => {
                deleteColor(record.id);
              }}
              okText="yes"
              cancelText="no"
              placement="left"
            >
              <DeleteOutlined style={{ cursor: "pointer", color: "red" }} />
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  return (
    <>
      <Table dataSource={dataColor} columns={columns} />
      <ColorUpdate
        idModalUpdateOpen={idModalUpdateOpen}
        setIsModalUpdateOpen={setIsModalUpdateOpen}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
        loadColor={loadColor}
      />
    </>
  );
};
export default ColorTable;
