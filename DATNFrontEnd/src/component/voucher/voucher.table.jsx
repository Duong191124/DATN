// import React, { useEffect, useState } from "react";
// import { Table, Space, Modal, notification } from "antd";
// import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import { fetchDataVoucher, deleteVoucher } from "../../service/api.service";
// import VoucherUpdateModal from "./voucher.update"; // Đổi tên thành Modal để đúng với Ant Design

// const VoucherTable = ({ refreshData }) => {
//     const [dataVoucher, setDataVoucher] = useState([]);
//     const [selectedVoucherId, setSelectedVoucherId] = useState(null); // Chỉ lưu ID để khi mở modal fetch lại chi tiết voucher
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [isAddSuccess, setIsAddSuccess] = useState(false);

//     const loadData = async () => {
//         try {
//             const response = await fetchDataVoucher();
//             if (response.data) {
//                 setDataVoucher(response.data);
//             }
//         } catch (error) {
//             notification.error({
//                 message: "Lỗi",
//                 description: "Không thể lấy dữ liệu voucher"
//             });
//         }
//     };

//     useEffect(() => {
//         loadData(); // Tải dữ liệu lần đầu
//     }, []); // Chỉ tải lần đầu

//     useEffect(() => {
//         if (refreshData) {
//             loadData(); // Tải lại dữ liệu khi refreshData thay đổi
//         }
//     }, [refreshData]); // Theo dõi refreshData

//     const handleDelete = (id) => {
//         Modal.confirm({
//             title: "Xác nhận xóa",
//             content: "Bạn có chắc chắn muốn xóa voucher này?",
//             onOk: async () => {
//                 try {
//                     const res = await deleteVoucher(id);
//                     if (res.status === 200 || res.status === 204) {
//                         notification.success({
//                             message: "Xóa Voucher",
//                             description: "Xóa voucher thành công."
//                         });
//                         loadData(); // Tải lại dữ liệu sau khi xóa
//                     } else {
//                         notification.error({
//                             message: "Xóa Voucher",
//                             description: "Đã có lỗi xảy ra khi xóa voucher."
//                         });
//                     }
//                 } catch (error) {
//                     notification.error({
//                         message: "Xóa Voucher",
//                         description: "Đã có lỗi xảy ra khi xóa voucher."
//                     });
//                 }
//             }
//         });
//     };

//     const handleEdit = (voucher) => {
//         setSelectedVoucherId(voucher.id); // Chỉ lưu ID voucher
//         setIsModalOpen(true); // Mở modal
//     };

//     const handleUpdateSuccess = () => {
//         setIsModalOpen(false); // Đóng modal sau khi cập nhật thành công
//         loadData(); // Tải lại dữ liệu
//     };

//     const columns = [
//         {
//             title: 'STT',
//             render: (text, record, index) => index + 1,
//         },
//         {
//             title: "ID",
//            dataIndex: 'id', // Hiển thị ID từ cơ sở dữ liệu
//         },
//         {
//             title: "Mã Voucher",
//             dataIndex: "code",
//         },
//         {
//             title: "Số lượng",
//             dataIndex: "quantity",
//         },
//         {
//             title: "Giảm giá (Số tiền)",
//             dataIndex: "discountAmount",
//         },
//         {
//             title: "Giảm giá (Phần trăm)",
//             dataIndex: "discountPercent",
//         },
//         {
//             title: "Ngày hết hạn",
//             dataIndex: "expirationDate",
//         },
//         {
//             title: "Trạng thái",
//             dataIndex: "status",
//             render: (status) => (status === 1 ? "Hoạt động" : "Hết hạn")
//         },
//         {
//             title: "Khách hàng ID",
//             dataIndex: "customers",
//         },
//         {
//             title: "Hành động",
//             key: "actions",
//             render: (_, record) => (
//                 <Space size="middle">
//                     <EditOutlined
//                         style={{ color: "blue", cursor: "pointer" }}
//                         onClick={() => handleEdit(record)}
//                     />
//                     <DeleteOutlined
//                         style={{ color: "red", cursor: "pointer" }}
//                         onClick={() => handleDelete(record.id)}
//                     />
//                 </Space>
//             )
//         }
//     ];

//     return (
//         <div>
//             <Table 
//                 columns={columns} 
//                 dataSource={dataVoucher} 
//                 rowKey="id" 
//                 pagination={{ pageSize: 2, showSizeChanger: false }}
//             />

//             {isModalOpen && (
//                 <VoucherUpdateModal
//                     visible={isModalOpen}
//                     voucherId={selectedVoucherId} // Truyền ID voucher cần chỉnh sửa
//                     onClose={() => setIsModalOpen(false)} // Đóng modal
//                     onSuccess={handleUpdateSuccess} // Thành công thì tải lại dữ liệu
//                 />
//             )}
//         </div>
        
//     );
// };

// export default VoucherTable;
