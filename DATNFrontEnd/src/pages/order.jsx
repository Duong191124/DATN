import { useEffect, useState } from "react";
import CreateOrder from "../component/layout/admin/order/order.create";
import OrderTable from "../component/layout/admin/order/order.table";
import { fetchDataOrders } from "../service/api.service";

const OrderPage = () => {
  const [dataOrder, SetDataOrder] = useState([]);
  useEffect(() => {
    loadOrder();
  }, []);
  const loadOrder = async () => {
    const response = await fetchDataOrders();
    if (response.data) {
      console.log("order:", response.data.data);
      SetDataOrder(response.data.data);
    }
  };
  return (
    <>
      <div style={{ textAlign: "center", margin: "28px 0" }}>
        <h1>Danh sách hóa đơn</h1>
      </div>
      <OrderTable dataOrder={dataOrder} loadOrder={loadOrder} />
    </>
  );
};
export default OrderPage;
