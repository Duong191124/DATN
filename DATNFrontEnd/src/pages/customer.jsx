import { useEffect, useState } from "react";
import CustomerTable from "../component/customer/customer.table";
import { getAllCustomer } from "../service/api.service";
import { Button } from "antd";
import CustomerCreate from "../component/customer/customer.create";
import CustomerUpdate from "../component/customer/customer.update";

const CustomerPage = () => {
  const [dataTable, setDataTable] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenU, setIsModalOpenU] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [dataDetail, setDataDetail] = useState(null);

  const loadData = async () => {
    try {
      const data = await getAllCustomer(page, size);
      setDataTable(data.data.data.content);
      setTotal(data.data.data.totalElements);
    } catch (error) {
      console.error("error", error);
    }
  };

  const hanleOpenCreate = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <h1 style={{ textAlign: 'center' }}>Customer manager</h1>
      <Button
        onClick={() => {
          hanleOpenCreate();
        }}
      >
        Create
      </Button>
      <CustomerTable
        dataTable={dataTable}
        loadData={loadData}
        setPage={setPage}
        setSize={setSize}
        page={page}
        size={size}
        total={total}
        setIsModalOpen={setIsModalOpen}
        setDataDetail={setDataDetail}
        setIsModalOpenU={setIsModalOpenU}
      />
      <CustomerCreate
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        loadData={loadData}
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
      />

      <CustomerUpdate
        isModalOpen={isModalOpenU}
        setIsModalOpen={setIsModalOpenU}
        loadData={loadData}
        dataDetail={dataDetail}
        setDataDetail={setDataDetail}
      />
    </>
  );
};

export default CustomerPage;
