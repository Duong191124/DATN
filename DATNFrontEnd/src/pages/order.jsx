import { useEffect, useState, useCallback, useMemo } from "react";
import { DatePicker, Radio, Input, Button } from "antd";
import OrderTable from "../component/layout/admin/order/order.table";
import { fetchDataOrders } from "../service/api.service";
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
        setLoading(false);
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
  };

  // Hàm reset bộ lọc, nhưng không thay đổi giá trị của staffName
  const handleResetFilters = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      startDate: null,
      endDate: null,
      status: "",
      orderCode: "",
      staffName: "", // Reset giá trị staffName về chuỗi rỗng
    }));
  };

  // Khi giá trị trong filters thay đổi, load lại danh sách đơn hàng
  useEffect(() => {
    console.log("loadOrder:", loadOrder); // Debugging loadOrder
    if (typeof loadOrder === "function") {
      loadOrder(currentPage, pageSize);
    } else {
      console.error("loadOrder is not a function");
    }
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
              value={filters.orderCode} // Set giá trị cho Search từ filter
              onChange={(e) => updateFilter("orderCode", e.target.value)} // Cập nhật giá trị khi người dùng gõ
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
              value={filters.staffName} // Set giá trị cho Search từ filter
              onChange={(e) => updateFilter("staffName", e.target.value)} // Cập nhật giá trị khi người dùng gõ
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
