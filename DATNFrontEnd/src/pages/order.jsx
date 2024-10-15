import { useEffect, useState, useCallback, useMemo } from "react";
import { DatePicker, Radio, Input, Button } from "antd";
import OrderTable from "../component/layout/admin/order/order.table";
import { fetchDataOrders } from "../service/api.service";
import moment from "moment";
import debounce from "lodash.debounce";

const { RangePicker } = DatePicker;
const { Search } = Input;

const OrderPage = () => {
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

  // Hàm load dữ liệu với các tham số filter
  const loadOrder = useCallback(
    async (page = 1, pageSize = 10) => {
      setLoading(true); // Bật loading ngay trước khi bắt đầu tải dữ liệu

      try {
        // Để tạo hiệu ứng loading, ta không fetch ngay lập tức
        setTimeout(async () => {
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
            console.error(
              "Không có dữ liệu trả về hoặc phản hồi không hợp lệ."
            );
          }
          setLoading(false);
        }, 1000); // Đợi 3 giây trước khi bắt đầu tải dữ liệu (để tạo hiệu ứng loading)
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
        setLoading(false); // Tắt loading ngay cả khi có lỗi
      }
    },
    [memoizedFilters]
  );

  // Hàm xử lý thay đổi khoảng thời gian
  const handleDateChange = (dates) => {
    setFilters({
      ...filters,
      startDate: dates ? dates[0].format("YYYY-MM-DD") : null,
      endDate: dates ? dates[1].format("YYYY-MM-DD") : null,
    });
  };

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    updateFilter(
      "status",
      selectedStatus === filters.status ? "" : selectedStatus
    );
  };

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
  };

  // Hàm reset bộ lọc
  const handleResetFilters = () => {
    setFilters({
      staffName: "",
      startDate: null,
      endDate: null,
      status: "",
      orderCode: "",
    });
  };

  // Khi giá trị trong filters thay đổi, load lại danh sách đơn hàng
  useEffect(() => {
    loadOrder(currentPage, pageSize);
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
            />
          </div>

          <div className="bill-order-code">
            <p>Mã đơn</p>
            <Search
              placeholder="Nhập mã đơn hàng ..."
              onSearch={handleOrderCodeSearch}
              enterButton
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
            dataOrder={dataOrder}
            currentPage={currentPage}
            pageSize={pageSize}
            totalOrders={totalOrders}
            handlePageChange={handlePageChange}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default OrderPage;
