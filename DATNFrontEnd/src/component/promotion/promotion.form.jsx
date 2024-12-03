import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  DatePicker,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import {
  createPromotion,
  fetchDataProductDetail,
} from "../../service/api.service";
import moment from "moment";

const PromotionForm = (props) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productDetails, setProductDetails] = useState([]);
  const { loadData } = props;
  const [discountType, setDiscountType] = useState("percent"); // Thêm state để lưu loại khuyến mãi

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetchDataProductDetail();
        if (res && res.data.data) {
          setProductDetails(res.data.data);
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

  const resetCloseModal = () => {
    setIsModalOpen(false);
    form.resetFields(); // Đặt lại toàn bộ form
    setDiscountType("percent");
  };

  const handleOpenModal = () => {
    // Khi mở modal, đặt giá trị mặc định cho "startDate" là thời gian hiện tại
    form.setFieldsValue({
      startDate: moment(),
      endDate: moment().add(1, "days"), // Giá trị mặc định cho ngày kết thúc
    });
    setIsModalOpen(true);
  };
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const startDate = values.startDate.format("YYYY-MM-DDTHH:mm:ss");
      const endDate = values.endDate.format("YYYY-MM-DDTHH:mm:ss");

      // Lấy giá trị của loại giảm giá và các giá trị liên quan
      let discountPercent = "0";
      let discountAmount = "0";

      if (discountType === "percent") {
        discountPercent = values.discountPercent;
      } else if (discountType === "amount") {
        discountAmount = values.discountAmount;
      }

      const res = await createPromotion({
        name: values.name,
        description: values.description,
        startDate: startDate,
        endDate: endDate,
        discountPercent: discountPercent,
        discountAmount: discountAmount,
        status: values.status,
      });

      if (res && res.data) {
        notification.success({
          message: "Tạo Khuyến Mại",
          description: "Tạo khuyến mại thành công",
        });
        resetCloseModal();
        await loadData();
      } else {
        notification.error({
          message: "Tạo Khuyến Mại",
          description: JSON.stringify(
            res.message || "Đã xảy ra lỗi không xác định"
          ),
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Vui lòng kiểm tra lại thông tin nhập liệu!",
      });
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <div>
        <Button onClick={handleOpenModal} type="primary">
          Tạo Khuyến Mại
        </Button>
      </div>

      <Modal
        title="Tạo Khuyến Mại"
        open={isModalOpen}
        onOk={() => {
          form.submit();
        }}
        onCancel={resetCloseModal}
        okText="Tạo"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            startDate: moment(), // Chỉ để đảm bảo có giá trị mặc định
            endDate: moment().add(1, "days"),
            status: 1,
          }}
        >
          <Form.Item
            label="Tên"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên khuyến mại!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Loại Giảm Giá"
            name="discountType"
            rules={[
              { required: true, message: "Vui lòng chọn loại giảm giá!" },
            ]}
          >
            <Select
              placeholder="Chọn Loại Giảm Giá"
              onChange={(value) => setDiscountType(value)}
            >
              <Select.Option value="percent">Phần Trăm</Select.Option>
              <Select.Option value="amount">Tiền Mặt</Select.Option>
            </Select>
          </Form.Item>

          {discountType === "percent" ? (
            <Form.Item
              label="Phần Trăm Giảm Giá(%)"
              name="discountPercent"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập phần trăm giảm giá!",
                },
                {
                  validator: (_, value) => {
                    if (value < 0 || value > 70) {
                      return Promise.reject(
                        new Error(
                          "Phần trăm giảm giá phải nằm trong khoảng từ 0 đến 70!"
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          ) : (
            <Form.Item
              label="Số Tiền Giảm Giá(VNĐ)"
              name="discountAmount"
              rules={[
                { required: true, message: "Vui lòng nhập số tiền giảm giá!" },
                {
                  validator: (_, value) => {
                    if (value < 1000 || value > 10000000) {
                      return Promise.reject(
                        new Error(
                          "Số tiền giảm giá phải từ 1,000 đến 10,000,000 VNĐ!"
                        )
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input type="number" />
            </Form.Item>
          )}

          <Form.Item
            label="Ngày Bắt Đầu"
            name="startDate"
            rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu!" }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) =>
                current && current < moment().startOf("day")
              }
              disabledTime={(current) => {
                if (moment().isSame(current, "day")) {
                  return {
                    disabledHours: () => [...Array(moment().hour()).keys()],
                    disabledMinutes: () => [
                      ...Array(moment().minute() + 1).keys(),
                    ],
                    disabledSeconds: () => [
                      ...Array(moment().second() + 1).keys(),
                    ],
                  };
                }
                return {};
              }}
            />
          </Form.Item>

          <Form.Item
            label="Ngày Kết Thúc"
            name="endDate"
            rules={[
              { required: true, message: "Vui lòng chọn ngày kết thúc!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value.isAfter(getFieldValue("startDate"))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Ngày kết thúc phải sau ngày bắt đầu!")
                  );
                },
              }),
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              disabledDate={(current) =>
                current && current < moment().startOf("day")
              }
              disabledTime={(current) => {
                if (moment().isSame(current, "day")) {
                  return {
                    disabledHours: () => [...Array(moment().hour()).keys()],
                    disabledMinutes: () => [
                      ...Array(moment().minute() + 1).keys(),
                    ],
                    disabledSeconds: () => [
                      ...Array(moment().second() + 1).keys(),
                    ],
                  };
                }
                return {};
              }}
            />
          </Form.Item>
          <Form.Item
            label="Trạng Thái"
            name="status"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select>
              <Select.Option value={1}>Hoạt động</Select.Option>
              <Select.Option value={0}>Ngừng hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PromotionForm;
