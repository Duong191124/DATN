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

    params.append("page", currentPage);
    params.append("limit", pageSize);

    navigate(`/admin/order?${params.toString()}`);
  };

  // Lấy tham số từ URL khi tải trang
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const newFilters = {
      staffName: queryParams.get("staffName") || "",
      startDate: queryParams.get("startDate") || null,
      endDate: queryParams.get("endDate") || null,
      status: queryParams.get("orderStatus") || "",
      orderCode: queryParams.get("orderCode") || "",
    };

    setFilters(newFilters);
    loadOrder(); // Tải lại đơn hàng với bộ lọc từ URL
  }, [location.search]); // Chạy khi URL thay đổi

  // Hàm load dữ liệu với các tham số filter
  const loadOrder = useCallback(
    async (page = 1, pageSize = 10) => {
      setLoading(true);
      try {
        const { staffName, startDate, endDate, status, orderCode } =
          memoizedFilters;
        const response = await fetchDataOrders(
          staffName,
          startDate,
          endDate,
          status,
          orderCode,
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
    }));
    updateUrl({
      staffName: "",
      startDate: null,
      endDate: null,
      status: "",
      orderCode: "",
    }); // Cập nhật URL khi reset
  };

  // Khi giá trị trong filters thay đổi, load lại danh sách đơn hàng
  useEffect(() => {
    loadOrder();
  }, [filters, currentPage, pageSize, loadOrder]);

  const handlePageChange = useCallback((page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  }, []);

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
              <Radio value="pending" style={{ marginBottom: "15px" }}>
                Chờ xử lý
              </Radio>
              <Radio value="process" style={{ marginBottom: "15px" }}>
                Đang xử lý
              </Radio>
              <Radio value="delivery" style={{ marginBottom: "15px" }}>
                Đang giao
              </Radio>
              <Radio value="shipped" style={{ marginBottom: "15px" }}>
                Đã giao
              </Radio>
              <Radio value="cancelled" style={{ marginBottom: "15px" }}>
                Đã hủy
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
