import { Button, Form, Input, Modal, notification, DatePicker, Select } from "antd";
import { useEffect, useState } from "react";
import { updatePromotion, detailPromotion, fetchDataProductDetail } from "../../service/api.service";
import moment from 'moment';

const PromotionUpdate = (props) => {
     const { isModalUpdateOpen, setIsModalUpdateOpen, dataUpdate, loadData } = props;
     const [form] = Form.useForm();
     const [productDetails, setProductDetails] = useState([]);

     // Fetch danh sách chi tiết sản phẩm
     useEffect(() => {
          const fetchProductDetails = async () => {
               try {
                    const res = await fetchDataProductDetail();

                    if (res && res.data) {
                         setProductDetails(res.data);
                    }
               } catch (error) {
                    notification.error({
                         message: "Lỗi",
                         description: "Không thể tải danh sách chi tiết sản phẩm",
                    });
               }
          };

          fetchProductDetails();
     }, []);

     // Fetch chi tiết khuyến mãi khi dataUpdate thay đổi
     useEffect(() => {
          if (dataUpdate) {
               const fetchPromotionDetail = async () => {
                    try {
                         const res = await detailPromotion(dataUpdate.id);
                         console.log(res);
                         if (res && res.data) {
                              form.setFieldsValue({
                                   name: res.data.name,
                                   description: res.data.description,
                                   discountPercent: res.data.discountPercent,
                                   discountAmount: res.data.discountAmount,
                                   startDate: moment(res.data.startDate),
                                   endDate: moment(res.data.endDate),
                                   status: res.data.status,
                                   productDetailsId: res.data.productDetailsId || [],
                              });
                         }
                    } catch (error) {
                         notification.error({
                              message: "Lỗi",
                              description: "Không thể tải chi tiết khuyến mãi",
                         });
                    }
               };

               fetchPromotionDetail();
          }
     }, [dataUpdate, form]);

     // Xử lý gửi dữ liệu cập nhật
     const handleSubmit = async () => {
          const values = form.getFieldsValue();
          const payload = {
               ...values,
               startDate: values.startDate.format("YYYY-MM-DDTHH:mm:ss"),
               endDate: values.endDate.format("YYYY-MM-DDTHH:mm:ss"),
          };

          try {
               const res = await updatePromotion(dataUpdate.id, payload);
               if (res && res.data) {
                    notification.success({
                         message: "Cập Nhật Khuyến Mãi",
                         description: "Cập nhật khuyến mãi thành công!",
                    });
                    form.resetFields();
                    setIsModalUpdateOpen(false);
                    loadData();
               }
          } catch (error) {
               notification.error({
                    message: "Lỗi",
                    description: "Không thể cập nhật khuyến mãi",
               });
          }
     };

     // Xử lý khi người dùng hủy
     const handleCancel = () => {
          form.resetFields();
          setIsModalUpdateOpen(false);
     };

     return (
          <Modal
               title="Chỉnh Sửa Khuyến Mãi"
               open={isModalUpdateOpen}
               onOk={handleSubmit}
               onCancel={handleCancel}
               okText="Cập Nhật"
          >
               <Form form={form} layout="vertical">
                    <Form.Item
                         label="Tên"
                         name="name"
                         rules={[{ required: true, message: 'Vui lòng nhập tên khuyến mãi!' }]}
                    >
                         <Input />
                    </Form.Item>
                    <Form.Item
                         label="Mô tả"
                         name="description"
                         rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
                    >
                         <Input />
                    </Form.Item>
                    <Form.Item
                         label="Phần Trăm Giảm Giá(%)"
                         name="discountPercent"
                         rules={[{ required: true, message: 'Vui lòng nhập phần trăm giảm giá!' }]}
                    >
                         <Input type="number" min={0} max={100} />
                    </Form.Item>
                    <Form.Item
                         label="Số Tiền Giảm Giá(VNĐ)"
                         name="discountAmount"
                         rules={[{ required: true, message: 'Vui lòng nhập số tiền giảm giá!' }]}
                    >
                         <Input type="number" />
                    </Form.Item>
                    <Form.Item
                         label="Ngày Bắt Đầu"
                         name="startDate"
                         rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu!' }]}
                    >
                         <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                         label="Ngày Kết Thúc"
                         name="endDate"
                         rules={[
                              { required: true, message: 'Vui lòng chọn ngày kết thúc!' },
                              ({ getFieldValue }) => ({
                                   validator(_, value) {
                                        const startDate = getFieldValue('startDate');
                                        if (!value || (startDate && value.isAfter(startDate))) {
                                             return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Ngày kết thúc không được trước ngày bắt đầu!'));
                                   },
                              }),
                         ]}
                    >
                         <DatePicker format="YYYY-MM-DD" />
                    </Form.Item>
                    <Form.Item
                         label="Trạng Thái"
                         name="status"
                         rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                    >
                         <Select>
                              <Select.Option value={1}>Hoạt động</Select.Option>
                              <Select.Option value={0}>Ngừng hoạt động</Select.Option>
                         </Select>
                    </Form.Item>
                    <Form.Item label="Chi Tiết Sản Phẩm" name="productDetailsId">
                         <Select>
                              {productDetails.map((item) => (
                                   <Select.Option key={item.id} value={item.id}>
                                        {item.code} {/* Hiển thị tên sản phẩm */}
                                   </Select.Option>
                              ))}
                         </Select>
                    </Form.Item>
               </Form>
          </Modal>
     );
};

export default PromotionUpdate;
