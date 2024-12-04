import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import {
    Button,
    DatePicker,
    Input,
    Modal,
    notification,
    Select,
    Space,
    Steps,
    Table,
    Tabs,
    TimePicker,
} from "antd";
import { useRef, useState, useEffect } from "react";
import {
    updateStatusOrder,
    colorFindById,
    productFindById,
    sizeFindById,
    getCreateOrderGhn,
    cancelOrderGhn,
} from "../../../../service/api.service";
import Highlighter from "react-highlight-words";
import html2pdf from "html2pdf.js";
import moment from "moment";
import "./order.css";
import { NavLink } from "react-router-dom";
const OrderTable = (props) => {
    const { Search } = Input;
    const { TabPane } = Tabs;
    const {
        dataOrder,
        handlePageChange,
        pageSize,
        currentPage,
        totalOrders,
        loading,
        setDataOrder,
    } = props;
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const [expandedRowKey, setExpandedRowKey] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});
    const [products, setProducts] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [isModalVisibleCancel, setIsModalVisibleCancel] = useState(false); // Trạng thái modal
    const [cancelNote, setCancelNote] = useState("");
    useEffect(() => {
        const fetchData = async (orderDetailResponses) => {
            if (orderDetailResponses) {
                try {
                    const productIds = orderDetailResponses.map(
                        (detail) => detail.productDetailId.productId
                    );
                    const productResponses = await Promise.all(
                        productIds.map((id) => productFindById(id))
                    );
                    setProducts(productResponses.map((res) => res.data.data));
                    const colorIds = orderDetailResponses.map(
                        (detail) => detail.productDetailId.colorId
                    );
                    const sizeIds = orderDetailResponses.map(
                        (detail) => detail.productDetailId.sizeId
                    );

                    const colorResponses = await Promise.all(
                        colorIds.map((id) => colorFindById(id))
                    );
                    const sizeResponses = await Promise.all(
                        sizeIds.map((id) => sizeFindById(id))
                    );
                    setColors(colorResponses.map((res) => res.data.data));
                    setSizes(sizeResponses.map((res) => res.data.data));
                } catch (error) {
                    console.error("Error fetching data: ", error);
                }
            }
        };
        if (expandedRowKey) {
            const orderDetail = dataOrder.find(
                (order) => order.id === expandedRowKey
            );
            if (orderDetail) fetchData(orderDetail.orderDetailResponses);
            setOrderDetails(orderDetail);
        }
    }, [expandedRowKey, dataOrder]);
    const getProductName = (productId) => {
        const product = products.find((item) => item.id === productId);
        return product ? product.name : "N/A";
    };
    const getColorName = (colorId) => {
        const color = colors.find((item) => item.id === colorId);
        return color ? color.name : "N/A";
    };
    const getSizeName = (sizeId) => {
        const size = sizes.find((item) => item.id === sizeId);
        return size ? size.name : "N/A";
    };
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };
    const statusOptions = [
        { value: "pending", label: "Chờ xử lý" },
        { value: "confirmed", label: "Đã xác nhận" },
        { value: "shipping", label: "Đang giao hàng" },
        { value: "delivered", label: "Đã giao" },
        { value: "completed", label: "Đã hoàn thành" },
        { value: "cancelled", label: "Đã hủy" },
    ];
    const showModal = (orderId, currentStatus) => {
        setCurrentOrderId(orderId);
        setSelectedStatus(currentStatus);
        setIsModalVisible(true);
    };
    const showCancelModal = () => {
        setIsModalVisibleCancel(true);
    };

    // Hàm đóng modal
    const handleCancel = () => {
        setIsModalVisibleCancel(false);
        setCancelNote("");
    };


    const handleUpdateStatus = async () => {
        try {
            const currentStatusIndex = statusOptions.findIndex(
                (option) => option.value === selectedStatus
            );
            const nextStatus = statusOptions[currentStatusIndex + 1]?.value; // Trạng thái tiếp theo

            if (nextStatus) {
                await updateStatusOrder(currentOrderId, nextStatus);
                notification.success({
                    message: "Cập nhật trạng thái",
                    description: "Cập nhật trạng thái thành công!",
                });
                setIsModalVisible(false);
                setSelectedStatus(nextStatus); // Cập nhật trạng thái đã chọn
                setDataOrder((prevDataOrder) =>
                    prevDataOrder.map((order) =>
                        order.id === currentOrderId
                            ? { ...order, status: nextStatus }
                            : order
                    )
                );
                if (nextStatus === "shipping") {
                    const order = dataOrder.find((order) => order.id === currentOrderId);
                    if (!order) {
                        notification.error({
                            message: "Lỗi",
                            description: "Không tìm thấy đơn hàng để xử lý.",
                        });
                        return;
                    }
                    const {
                        code: orderCode,
                        address: { district, ward, name, phoneNumber, addressDetail },
                        deliveryFee: totalShippingFee,
                        customerResponse: { email: customerEmail },
                        orderDetailResponses,
                    } = order;
                    const productIds = orderDetailResponses.map(
                        (detail) => detail.productDetailId.productId
                    );
                    const productResponses = await Promise.all(
                        productIds.map(async (id) => {
                            try {
                                return await productFindById(id); // Gọi API lấy dữ liệu sản phẩm
                            } catch (error) {
                                console.error(`Không thể lấy thông tin sản phẩm với ID: ${id}`, error);
                                return null; // Trả về null nếu có lỗi
                            }
                        })
                    );
                    const productsData = orderDetailResponses.map((detail) => {
                        const productResponse = productResponses.find(
                            (product) => product?.data?.data?.id === detail.productDetailId.productId
                        );

                        return {
                            product: {
                                name: productResponse?.data?.data?.name || "Unknown",
                                categoryName: productResponse?.data?.data?.categoryName || "Unknown",
                            },
                            code: detail.productDetailId.code,
                            quantity: detail.quantity,
                        };
                    });

                    const totalWeight = orderDetailResponses.reduce((total, detail) => {
                        const weight = detail?.productDetailId?.weight || 0; // Lấy weight từ productResponse
                        return total + weight * (detail.quantity || 0);
                    }, 0);

                    const createOrderGhn = {
                        orderCode,
                        toDistrictId: district,
                        toWardCode: ward,
                        weight: totalWeight,
                        paymentType: 2,
                        shipCOD: totalShippingFee,
                        customerName: name,
                        customerPhone: phoneNumber,
                        addressDetail,
                        customerEmail,
                        productsData,
                    };

                    const createOrderGhnResponse = await getCreateOrderGhn(
                        createOrderGhn.orderCode,
                        createOrderGhn.toDistrictId,
                        createOrderGhn.toWardCode,
                        createOrderGhn.weight,
                        createOrderGhn.paymentType,
                        createOrderGhn.shipCOD,
                        createOrderGhn.customerName,
                        createOrderGhn.customerPhone,
                        createOrderGhn.addressDetail,
                        createOrderGhn.customerEmail,
                        createOrderGhn.productsData
                    );

                    // If there is any error in the GHN response, throw an error
                    if (createOrderGhnResponse?.error) {
                        throw new Error(createOrderGhnResponse?.error || "Giao hàng không thành công.");
                    }
                }
            } else {
                notification.error({
                    message: "Lỗi",
                    description: "Không thể chuyển đến trạng thái tiếp theo.",
                    placement: "top",
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi khi cập nhật trạng thái",
                description: JSON.stringify(error.message),
                placement: "top",
            });
        }
    };

    const canceledOrder = async (orderId, status, cancelNote) => {
        try {
            const res = await updateStatusOrder(orderId, status, cancelNote);
            const trackingId = res.data.data.trackingId;
            console.log(trackingId);
            await cancelOrderGhn(trackingId);
            setDataOrder((prevDataOrder) =>
                prevDataOrder.map((order) =>
                    order.id === orderId ? { ...order, status: "cancelled" } : order
                )
            );
            notification.warning({
                message: "Cập nhật trạng thái",
                description: "Đơn hàng đã bị hủy.",
            });
        } catch (error) {
            // Hiển thị thông báo lỗi
            notification.error({
                message: "Lỗi khi hủy đơn hàng",
                description: JSON.stringify(error.message),
                placement: "top",
            });
        }
    };

    const handleOk = async () => {
        if (!cancelNote) {
            notification.warning({
                message: "Cảnh báo",
                description: "Vui lòng nhập lý do hủy.",
            });
            return;
        }
        try {
            // Gọi hàm hủy đơn với lý do
            await canceledOrder(orderDetails.id, "cancelled", cancelNote);
            setIsModalVisibleCancel(false);
            setCancelNote(""); // Reset note sau khi hủy
        } catch (error) {
            notification.error({
                message: "Lỗi khi hủy đơn hàng",
                description: "Đã xảy ra lỗi khi hủy đơn hàng.",
            });
        }
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Tìm kiếm ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: "block" }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm kiếm
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Làm mới
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Lọc
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        Đóng
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: "STT",
            render: (_, record, index) => {
                return <>{index + 1 + (currentPage - 1) * pageSize}</>;
            },
        },
        {
            title: "Mã Đơn Hàng",
            dataIndex: "code",
            key: "code",
        },
        {
            title: "Thời gian tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => {
                return text ? moment(text).format("YYYY-MM-DD HH:mm:ss A") : "N/A";
            },
        },
        {
            title: "Tên Nhân Viên",
            dataIndex: "staffResponse",
            key: "staffResponse",
            render: (text, record) => {
                return record.staffResponse?.name || "Chưa có thông tin";
            },
        },
        {
            title: "Trạng Thái",
            dataIndex: "status",
            key: "status",
            ...getColumnSearchProps("status"),
            render: (status, record) => {
                const statusOptions = [
                    { value: "pending_payment", label: "Chờ thanh toán" },
                    { value: "pending", label: "Chờ xử lý" },
                    { value: "confirmed", label: "Đã xác nhận" },
                    { value: "shipping", label: "Đang giao hàng" },
                    { value: "delivered", label: "Đã giao" },
                    { value: "completed", label: "Đã hoàn thành" },
                    { value: "cancelled", label: "Đã hủy" },
                ];
                const currentStatus = statusOptions.find(
                    (option) => option.value === status
                );

                return currentStatus ? currentStatus.label : "N/A";
            },
        },
        {
            title: "Loại Đơn Hàng",
            dataIndex: "orderType",
            key: "orderType",
        },
        {
            title: "Hành Động",
            render: (_, record) => (
                <Button
                    icon={<EditOutlined />}
                    style={{ color: "blue" }}
                    onClick={() => showModal(record.id, record.status)}
                    disabled={
                        record.orderType === "offline" ||
                        record.status === "cancelled" ||
                        record.status === "completed"
                    }
                >
                    Cập nhật trạng thái
                </Button>
            ),
        },
    ];

    const columnsOrderDetail = [
        { title: "Mã HDCT", dataIndex: "id", key: "id" },
        {
            title: "Mã sản phẩm chi tiết",
            key: "product_detail_code",
            render: (text, record) => record.productDetailId?.code || "N/A",
        },
        {
            title: "Tên sản phẩm",
            key: "product_detail_productId",
            render: (text, record) =>
                getProductName(record.productDetailId?.productId),
        },
        {
            title: "Số lượng",
            key: "order_detail_quantity",
            render: (text, record) => record.quantity || "N/A",
        },
        {
            title: "Size",
            key: "order_detail_size",
            render: (text, record) => getSizeName(record.productDetailId?.sizeId),
        },
        {
            title: "Color",
            key: "order_detail_color",
            render: (text, record) => getColorName(record.productDetailId?.colorId),
        },
        {
            title: "Giá",
            dataIndex: "defaultPrice",
            render: (text, record) => {
                const { discountPrice, defaultPrice } = record.productDetailId;
                if (discountPrice && discountPrice < defaultPrice) {
                    return (
                        <span>
                            <span style={{ textDecoration: "line-through", color: "gray" }}>
                                {defaultPrice
                                    ? `${defaultPrice.toLocaleString()} VNĐ`
                                    : "Chưa có giá"}
                            </span>
                            <span style={{ marginLeft: "8px", color: "red" }}>
                                {discountPrice
                                    ? `${discountPrice.toLocaleString()} VNĐ`
                                    : "Chưa có giá"}
                            </span>
                        </span>
                    );
                }
                // Nếu không có giảm giá, chỉ hiển thị giá gốc
                return discountPrice
                    ? `${discountPrice.toLocaleString()} VNĐ`
                    : defaultPrice
                        ? `${defaultPrice.toLocaleString()} VNĐ`
                        : "Chưa có giá";
            },
        },
        {
            title: "Hình ảnh",
            key: "product_detail_image",
            render: (text, record) =>
                record.productDetailId?.image ? (
                    <img
                        src={record.productDetailId.image}
                        alt="Product"
                        style={{ width: 50 }}
                    />
                ) : (
                    "N/A"
                ),
        },
    ];

    const columnsHistoryPayment = [
        {
            title: "Mã phiếu",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Thời gian",
            dataIndex: "paymentDate",
            key: "paymentDate",
            render: (text) => moment.utc(text).local().format("DD/MM/YYYY"),
        },
        {
            title: "Người tạo",
            key: "staffName",
            render: (text, record) => {
                return (
                    record.orderDataPaymentResponse?.staffResponse?.name ||
                    "Chưa có thông tin"
                );
            },
        },
        {
            title: "Giá trị đơn hàng",
            key: "totalAmount",
            render: (text, record) => {
                return `${record.orderDataPaymentResponse?.totalAmount.toLocaleString()} VNĐ`;
            },
        },
        {
            title: "Phương thức",
            key: "paymentMethod",
            render: (text, record) => {
                const paymentMethods = {
                    "Credit Card": "Thẻ tín dụng",
                    PayPal: "PayPal",
                    Cash: "Tiền mặt",
                    "Bank Transfer": "Chuyển khoản ngân hàng",
                    "Gift Card": "Thẻ quà tặng",
                    COD: "Thanh toán khi nhận hàng",
                    VNP: "VNPay",
                };
                return paymentMethods[record.paymentMethod] || "Không xác định";
            },
        },
        {
            title: "Trạng thái",
            key: "status",
            render: (text, record) => {
                const statusOptions = {
                    pending_payment: "Chờ thanh toán",
                    pending: "Chờ xử lý",
                    confirmed: "Đang xử lý",
                    shipping: "Đang giao hàng",
                    delivered: "Đã giao",
                    completed: "Đã hoàn thành",
                    cancelled: "Đã hủy",
                };
                return (
                    statusOptions[record.orderDataPaymentResponse.status] ||
                    "Không xác định"
                );
            },
        },
    ];
    const createInvoiceContent = () => {
        const totalQuantity = getTotalQuantity(
            orderDetails.orderDetailResponses || []
        );
        const orderDetailRows = orderDetails.orderDetailResponses
            .map(
                (record) => `
          <tr>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${record.id
                    }</td>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${record.productDetailId?.code || "N/A"
                    }</td>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${getProductName(
                        record.productDetailId?.productId
                    )}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${record.quantity || "N/A"
                    }</td>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${getSizeName(
                        record.productDetailId?.sizeId
                    )}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${getColorName(
                        record.productDetailId?.colorId
                    )}</td>
            <td style="border: 1px solid #000; padding: 10px; text-align:center;">${record.price.toLocaleString()} VND</td>
          </tr>
        `
            )
            .join("");

        const pdfContent = `
      <div id="invoice" style="font-family: Arial, sans-serif; line-height: 1.5; font-size: 14px; padding: 20px;">
        <div style="text-align:center; margin-bottom: 20px;">
          <img src="/image/logo.jpg" alt="Logo" style="width: 150px; height: auto;" />
        </div>
        <h2 style="text-align: center; font-size: 24px; font-weight: bold;">SPORT SHIRT</h2>
        <p style="text-align: center; font-size: 16px;">Địa chỉ: - -</p>
        <p style="text-align: center; font-size: 16px;">Điện thoại: 0999999999</p>
        <h2 style="text-align: center; font-size: 24px; font-weight: bold;">HÓA ĐƠN BÁN HÀNG</h2>
        <p style="font-size: 16px;">Mã hóa đơn: ${orderDetails.code}</p>
        <p style="font-size: 16px;">Ngày: ${orderDetails.orderDate}</p>
        <p style="font-size: 16px;">Nhân viên: ${orderDetails?.staffResponse?.name ?? "Không có nhân viên"
            }</p>
        <p style="font-size: 16px;">Khách hàng: ${orderDetails.customerResponse.name
            }</p>
        <p style="font-size: 16px;">SĐT: ${orderDetails.customerResponse.phoneNumber
            }</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Mã HDCT</th>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Mã sản phẩm</th>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Tên sản phẩm</th>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Số lượng</th>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Size</th>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Color</th>
              <th style="border: 1px solid #000; padding: 10px; background-color: #f2f2f2;">Giá</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetailRows}
          </tbody>
        </table>
        <div style="margin-top: 20px; display: flex; flex-direction: column;">
          <div style="width: 250px; border: 1px solid #ddd; padding: 10px;">
            <div className="result_order_detail">
              <span>Giảm giá hóa đơn:</span>
            ${orderDetails.voucherId
                ? orderDetails.voucherId.discountAmount !== "0"
                    ? `${orderDetails.voucherId.discountAmount} VND`
                    : `${orderDetails.voucherId.discountPercent}%`
                : "0 VND (0%)"
            }
            </div>
            <div className="result_order_detail">
              <span>Tổng số lượng:</span>
              <span>${totalQuantity}</span>
            </div>
            <div className="result_order_detail">
              <span>Tổng tiền hàng:</span>
              <span>${orderDetails.totalAmount.toLocaleString()} VND</span>
            </div>
            <div className="result_order_detail">
              <span>Trạng thái:</span>
              <span>
                ${(() => {
                const statusOptions = [
                    { value: "pending", label: "Chờ xử lý" },
                    { value: "process", label: "Đang xử lý" },
                    { value: "delivery", label: "Đang giao" },
                    { value: "shipped", label: "Đã giao" },
                    { value: "cancelled", label: "Đã hủy" },
                ];
                const currentStatus = statusOptions.find(
                    (option) => option.value === orderDetails.status
                );
                return currentStatus ? currentStatus.label : "";
            })()}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;

        return pdfContent;
    };
    const generatePDF = () => {
        const invoiceContent = createInvoiceContent(); // Lấy nội dung hóa đơn
        const invoiceElement = document.createElement("div");
        invoiceElement.innerHTML = invoiceContent; // Đặt nội dung vào phần tử
        document.body.appendChild(invoiceElement); // Thêm vào DOM

        const options = {
            margin: 1,
            filename: "invoice.pdf",
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };
        // Tạo PDF
        html2pdf()
            .from(invoiceElement)
            .set(options)
            .save()
            .then(() => {
                document.body.removeChild(invoiceElement); // Xóa phần tử sau khi tạo PDF
            });
    };

    const getTotalQuantity = (orderDetailResponses) => {
        return orderDetailResponses.reduce(
            (total, detail) => total + (detail.quantity || 0),
            0
        );
    };

    const expandedRowRender = (record) => {
        const totalQuantity = getTotalQuantity(record.orderDetailResponses || []);
        // Kiểm tra nếu không có nhân viên
        const hasStaff = orderDetails?.staffResponse != null;

        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="Chi Tiết Đơn Hàng" key="1">
                    <div style={{ margin: "0 28px" }}>
                        {orderDetails && (
                            <div style={{ marginTop: 20 }}>
                                <div className="order_detail">
                                    <div className="col-4">
                                        <p>Mã hóa đơn: {orderDetails.code}</p>
                                        <p>
                                            Thời gian mua:
                                            <DatePicker
                                                disabled
                                                style={{
                                                    marginLeft: "10px",
                                                    width: "65%",
                                                }}
                                                value={
                                                    record.updatedAt ? moment(record.updatedAt) : null
                                                }
                                                showTime={{
                                                    format: "hh:mm:ss A",
                                                }}
                                                format="YYYY-MM-DD hh:mm:ss A"
                                            />
                                        </p>
                                        <p>Khách hàng: {orderDetails?.customerResponse?.name}</p>
                                    </div>
                                    <div className="col-4">
                                        <p>
                                            Trạng thái:{" "}
                                            {(() => {
                                                const statusOptions = [
                                                    { value: "pending_payment", label: "Chờ thanh toán" },
                                                    { value: "pending", label: "Chờ xử lý" },
                                                    { value: "confirmed", label: "Đã xác nhận" },
                                                    { value: "shipping", label: "Đang giao hàng" },
                                                    { value: "delivered", label: "Đã giao" },
                                                    { value: "completed", label: "Đã hoàn thành" },
                                                    { value: "cancelled", label: "Đã hủy" },
                                                ];
                                                const currentStatus = statusOptions.find(
                                                    (option) => option.value === orderDetails.status
                                                );
                                                return currentStatus ? currentStatus.label : "";
                                            })()}
                                        </p>

                                        {/* Thêm thông tin khách hàng nếu không có nhân viên */}

                                        <p>
                                            Phí giao hàng:
                                            {orderDetails.deliveryFee
                                                ? `${orderDetails.deliveryFee.toLocaleString()} VND`
                                                : " Không có"}
                                        </p>
                                        <p>
                                            Mã nhân viên:
                                            {orderDetails.staffResponse?.name || "Chưa có thông tin"}
                                        </p>
                                    </div>
                                    {!hasStaff && (
                                        <div className="col-4">
                                            <p>Khách nhận: {orderDetails.address?.name}</p>
                                            <p>Số điện thoại: {orderDetails.address?.phoneNumber}</p>
                                            <p>Địa chỉ: {orderDetails.address?.addressDetail}</p>
                                        </div>
                                    )}
                                </div>
                                <Table
                                    style={{ margin: "28px 0", border: "1px solid #d9d9d9" }}
                                    pagination={false}
                                    columns={columnsOrderDetail}
                                    dataSource={orderDetails.orderDetailResponses}
                                    rowKey="id"
                                />

                                <div style={{ display: "flex", justifyContent: "end" }}>
                                    <div style={{ width: "350px" }}>
                                        <div className="result_order_detail">
                                            <span>Tổng số lượng:</span>
                                            <span>{totalQuantity} </span>
                                        </div>
                                        <div className="result_order_detail">
                                            <span>Giảm giá hóa đơn:</span>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    background:
                                                        "linear-gradient(to right, #ff5722, #ff1744)",
                                                    borderRadius: "15px",
                                                    padding: "10px",
                                                    color: "#fff",
                                                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                                    overflow: "hidden",
                                                    height: "50px",
                                                    transition: "height 0.3s ease",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.height = "75px";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.height = "50px";
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <span
                                                        style={{ fontSize: "16px", fontWeight: "bold" }}
                                                    >
                                                        {orderDetails.voucherId ? (
                                                            orderDetails.voucherId.discountPercent > 0 ? (
                                                                <span style={{ color: "#fff" }}>
                                                                    Giảm giá{" "}
                                                                    {orderDetails.voucherId.discountPercent}%
                                                                </span>
                                                            ) : orderDetails.voucherId.discountAmount > 0 ? (
                                                                <span style={{ color: "#fff" }}>
                                                                    Giảm giá{" "}
                                                                    {new Intl.NumberFormat("vi-VN").format(
                                                                        orderDetails.voucherId.discountAmount
                                                                    )}{" "}
                                                                    VNĐ
                                                                </span>
                                                            ) : (
                                                                "Không áp dụng voucher"
                                                            )
                                                        ) : (
                                                            "Không có voucher"
                                                        )}
                                                    </span>
                                                </div>

                                                {orderDetails.voucherId &&
                                                    orderDetails.voucherId.discountPercent && (
                                                        <div
                                                            style={{
                                                                fontSize: "11px",
                                                                color: "#fff",
                                                                borderTop: "1px solid rgba(255, 255, 255, 0.3)", // Phân cách giữa các phần
                                                                paddingTop: "5px",
                                                                marginTop: "5px",
                                                            }}
                                                        >
                                                            Tối đa{" "}
                                                            {new Intl.NumberFormat("vi-VN").format(
                                                                orderDetails.voucherId.maxDiscountAmount
                                                            )}{" "}
                                                            đ cho đơn từ{" "}
                                                            {new Intl.NumberFormat("vi-VN").format(
                                                                orderDetails.voucherId.minPurchaseAmount
                                                            )}{" "}
                                                            đ
                                                        </div>
                                                    )}
                                                {orderDetails.voucherId &&
                                                    orderDetails.voucherId.discountAmount && (
                                                        <div
                                                            style={{
                                                                fontSize: "11px",
                                                                color: "#fff",
                                                                borderTop: "1px solid rgba(255, 255, 255, 0.3)", // Phân cách giữa các phần
                                                                paddingTop: "5px",
                                                                marginTop: "5px",
                                                            }}
                                                        >
                                                            Đơn hàng tối thiểu{" "}
                                                            {new Intl.NumberFormat("vi-VN").format(
                                                                orderDetails.voucherId.minPurchaseAmount
                                                            )}{" "}
                                                            đ
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                        <div className="result_order_detail">
                                            <span className="">Tổng tiền hàng:</span>
                                            <span>
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })
                                                    .format(orderDetails.totalAmount)
                                                    .replace("₫", "VNĐ")}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "end",
                                        margin: "28px 0",
                                    }}
                                >
                                    <Button
                                        style={{ marginRight: "15px" }}
                                        type="primary"
                                        onClick={generatePDF}
                                    >
                                        Xuất PDF
                                    </Button>
                                    <Button
                                        danger
                                        disabled={
                                            orderDetails.status !== "pending" &&
                                            orderDetails.status !== "confirmed" &&
                                            orderDetails.status !== "pending_payment" &&
                                            orderDetails.status !== "shipping"
                                        }
                                        onClick={showCancelModal}
                                    >
                                        Hủy hóa đơn
                                    </Button>
                                    <Modal
                                        title="Nhập lý do hủy đơn hàng"
                                        visible={isModalVisibleCancel}
                                        onOk={handleOk}
                                        onCancel={handleCancel}
                                        okText="Xác nhận"
                                        cancelText="Hủy"
                                    >
                                        <Input.TextArea
                                            rows={4}
                                            placeholder="Vui lòng nhập lý do hủy đơn hàng..."
                                            value={cancelNote}
                                            onChange={(e) => setCancelNote(e.target.value)}
                                        />
                                    </Modal>
                                </div>
                            </div>
                        )}
                    </div>
                </TabPane>
                <TabPane tab="Lịch Sử" key="2">
                    <Table
                        columns={columnsHistoryPayment}
                        dataSource={record.paymentResponses.map((payment) => ({
                            ...payment,
                            key: payment.id,
                        }))}
                        style={{ margin: "28px 0", border: "1px solid #d9d9d9" }}
                        pagination={false}
                    />
                    {record.status === "cancelled" && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                marginTop: "16px",
                            }}
                        >
                            <div
                                style={{
                                    width: "100%",
                                    backgroundColor: "#f7f7f7",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "600",
                                        marginBottom: "8px",
                                        color: "#333",
                                    }}
                                >
                                    Lý do hủy:
                                </p>
                                <Input
                                    value={record.note}
                                    disabled
                                    style={{
                                        padding: "10px",
                                        fontSize: "14px",
                                        borderRadius: "4px",
                                        border: "1px solid #ccc",
                                        backgroundColor: "#fff",
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </TabPane>
            </Tabs>
        );
    };

    return (
        <>
            <Table
                style={{ border: "1px solid #ddd" }}
                columns={columns}
                dataSource={dataOrder}
                rowKey="id"
                expandable={{
                    expandedRowRender: (record) => expandedRowRender(record),
                    expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
                    onExpand: (expanded, record) => {
                        // Chỉ cần expand hoặc thu gọn khi click vào dấu cộng
                        if (expanded) {
                            setExpandedRowKey(record.id);
                        } else {
                            setExpandedRowKey(null);
                        }
                    },
                }}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalOrders,
                    onChange: handlePageChange,
                }}
                loading={loading}
            />
            <Modal
                title="Cập nhật trạng thái đơn hàng"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
                        Đóng
                    </Button>,
                    <Button key="confirm" type="primary" onClick={handleUpdateStatus}>
                        Xác nhận chuyển trạng thái
                    </Button>,
                ]}
                width={1000}
            >
                <Steps
                    current={statusOptions.findIndex(
                        (option) => option.value === selectedStatus
                    )}
                >
                    {statusOptions.map((status, index) => (
                        <Steps.Step
                            key={status.value}
                            title={status.label}
                            disabled={
                                status.value === "shipped" ||
                                status.value === "cancelled" ||
                                index <=
                                statusOptions.findIndex(
                                    (option) => option.value === selectedStatus
                                )
                            }
                        />
                    ))}
                </Steps>
            </Modal>
        </>
    );
};

export default OrderTable;