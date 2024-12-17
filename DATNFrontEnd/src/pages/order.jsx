import { useEffect, useState, useCallback, useMemo } from "react";
import { DatePicker, Radio, Input, Button } from "antd";
import OrderTable from "../component/layout/admin/order/order.table";
import { fetchDataOrders } from "../service/api.service";
import debounce from "lodash.debounce";
import { useLocation, useNavigate } from "react-router-dom"; // Thêm import này

const { RangePicker } = DatePicker;
const { Search } = Input;

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [dataOrder, setDataOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    staffName: "",
    startDate: null,
    endDate: null,
    status: "",
    orderCode: "",
    orderType: "",
  });
  // Memoize the filters object to avoid unnecessary re-renders
  const memoizedFilters = useMemo(() => filters, [filters]);
  // Cập nhật URL khi bộ lọc thay đổi
  const updateUrl = (newFilters) => {
    const params = new URLSearchParams();
    if (newFilters.staffName) params.append("staffName", newFilters.staffName);
    if (newFilters.startDate) params.append("startDate", newFilters.startDate);
    if (newFilters.endDate) params.append("endDate", newFilters.endDate);
    if (newFilters.status) params.append("orderStatus", newFilters.status);
    if (newFilters.orderCode) params.append("orderCode", newFilters.orderCode);
    if (newFilters.orderType) params.append("orderType", newFilters.orderType);
    params.append("page", currentPage);
    params.append("limit", pageSize);

    navigate(`/admin/order?${params.toString()}`);
  };

  // Lấy tham số từ URL khi tải trang
  useEffect(() => {
    setFilters(memoizedFilters);
    updateUrl(filters);
    loadOrder(); // Tải lại đơn hàng với bộ lọc từ URL
  }, [filters, memoizedFilters]); // Chạy khi URL thay đổi
  const handlePageChange = useCallback((page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    loadOrder(page, pageSize); // Chuyển trang và kích thước trang vào loadOrder
  }, []);
  // Hàm load dữ liệu với các tham số filter
  const loadOrder = useCallback(
    async (page = 1, pageSize = 10) => {
      setLoading(true);
      try {
        const { staffName, startDate, endDate, status, orderCode, orderType } =
          memoizedFilters;
        const response = await fetchDataOrders(
          staffName,
          startDate,
          endDate,
          status,
          orderCode,
          orderType,
          page - 1,
          pageSize
        );

        if (response && response.data) {
          setDataOrder(response.data.orderResponseList);
          setTotalOrders(response.data.totalPage * pageSize);
        } else {
          console.error("Không có dữ liệu trả về hoặc phản hồi không hợp lệ.");
        }
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
      } finally {
        setLoading(false); // Tắt loading ngay cả khi có lỗi
      }
    },
    [memoizedFilters]
  );

  // Hàm xử lý thay đổi khoảng thời gian
  const handleDateChange = (dates) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      startDate: dates ? dates[0].format("YYYY-MM-DD") : null,
      endDate: dates ? dates[1].format("YYYY-MM-DD") : null,
    }));
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    updateFilter(
      "status",
      selectedStatus === filters.status ? "" : selectedStatus
    );
  };
  const handleOrderStyleChange = (e) => {
    const selectedOrderType = e.target.value;
    updateFilter(
      "orderType",
      selectedOrderType === filters.orderType ? "" : selectedOrderType
    );
  };
  // Hàm tìm kiếm nhân viên với debounce
  const handleStaffSearch = debounce((value) => {
    updateFilter("staffName", value);
  }, 500);

  const handleOrderCodeSearch = debounce((value) => {
    updateFilter("orderCode", value);
  }, 500);

  // Hàm update filter
  const updateFilter = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    updateUrl({ ...filters, [key]: value }); // Cập nhật URL với bộ lọc mới
  };

  // Hàm reset bộ lọc, nhưng không thay đổi giá trị của staffName
  const handleResetFilters = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      startDate: null,
      endDate: null,
      status: "",
      orderCode: "",
      staffName: "",
      orderType: "",
    }));
    updateUrl({
      staffName: "",
      startDate: null,
      endDate: null,
      status: "",
      orderCode: "",
      orderType: "",
    }); // Cập nhật URL khi reset
  };
  // Khi giá trị trong filters thay đổi, load lại danh sách đơn hàng
  useEffect(() => {
    loadOrder(currentPage, pageSize);
  }, [filters, currentPage, pageSize]);
  console.log("filters", filters.orderType);
  return (
    <>
      <div style={{ textAlign: "center", margin: "28px 0" }}>
        <h1>Danh sách hóa đơn</h1>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div className="filter-bill">
          <div className="bill-order-code">
            <p>Mã đơn</p>
            <Search
              placeholder="Nhập mã đơn hàng ..."
              onSearch={handleOrderCodeSearch}
              enterButton
              value={filters.orderCode}
              onChange={(e) => updateFilter("orderCode", e.target.value)}
            />
          </div>
          <div className="bill-date">
            <p>Thời gian</p>
            <RangePicker
              style={{ width: "100%" }}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
            />
          </div>
          <div className="bill-status">
            <p>Trạng thái</p>
            <Radio.Group
              style={{ display: "flex", flexDirection: "column" }}
              value={filters.status}
              onChange={handleStatusChange}
            >
              <Radio value="pending_payment" style={{ marginBottom: "15px" }} disabled={filters.orderType === "online"}>
                Chờ thanh toán
              </Radio>
              <Radio
                value="pending"
                style={{ marginBottom: "15px" }}
                disabled={filters.orderType === "offline"}
              >
                Chờ xử lý
              </Radio>
              <Radio
                value="confirmed"
                style={{ marginBottom: "15px" }}
                disabled={filters.orderType === "offline"}
              >
                Xác nhận
              </Radio>
              <Radio
                value="shipping"
                style={{ marginBottom: "15px" }}
                disabled={filters.orderType === "offline"}
              >
                Đang giao
              </Radio>
              <Radio
                value="delivered"
                style={{ marginBottom: "15px" }}
                disabled={filters.orderType === "offline"}
              >
                Đã giao
              </Radio>
              <Radio value="completed" style={{ marginBottom: "15px" }}>
                Đã hoàn thành
              </Radio>
              <Radio value="cancelled" style={{ marginBottom: "15px" }}>
                Đã hủy
              </Radio>
            </Radio.Group>
          </div>
          <div className="bill-status">
            <p>Trạng thái đơn hàng</p>
            <Radio.Group
              style={{ display: "flex", flexDirection: "column" }}
              value={filters.orderType}
              onChange={handleOrderStyleChange}
            >
              <Radio value="online" style={{ marginBottom: "15px" }}>
                Online
              </Radio>
              <Radio value="offline" style={{ marginBottom: "15px" }}>
                Offline
              </Radio>
            </Radio.Group>
          </div>
          <div className="bill-staff">
            <p>Nhân viên</p>
            <Search
              placeholder="Nhập tên nhân viên ..."
              onSearch={handleStaffSearch}
              enterButton
              value={filters.staffName}
              onChange={(e) => updateFilter("staffName", e.target.value)}
            />
          </div>
          <Button
            style={{ marginTop: "20px" }}
            onClick={handleResetFilters}
            type="default"
          >
            Reset Bộ lọc
          </Button>
        </div>
        <div className="table-bill">
          <OrderTable
            filters={filters}
            dataOrder={dataOrder}
            currentPage={currentPage}
            pageSize={pageSize}
            totalOrders={totalOrders}
            handlePageChange={handlePageChange}
            loading={loading}
            handleOrderCodeSearch={handleOrderCodeSearch}
            setDataOrder={setDataOrder}
          />
        </div>
      </div>
    </>
  );
};

export default OrderPage;
