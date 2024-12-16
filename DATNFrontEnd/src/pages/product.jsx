import React, { useEffect, useState } from "react";
import ProductForm from "../component/product/product.form";
import ProductTable from "../component/product/product.table";
import { fetchDataPageAndFilterProduct } from "../service/api.service"; // Thay thế bằng hàm bạn đã cập nhật
import { Input, Select, Button } from "antd";
import { useLocation } from "react-router-dom";

const { Option } = Select;

const ProductPage = () => {
  const [dataProduct, setDataProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [searchName, setSearchName] = useState(""); // Trạng thái cho tên tìm kiếm
  const [status, setStatus] = useState(""); // Trạng thái cho lọc
  const [brand, setBrand] = useState(""); // Trạng thái cho lọc
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brandIdFromUrl = params.get("brand_id");
    if (brandIdFromUrl) {
      setBrand(brandIdFromUrl);
    }
  }, [location.search]);


  useEffect(() => {
    loadProduct();
  }, [page, pageSize, searchName, status, brand]); // Thêm status vào dependency array

  const loadProduct = async () => {
    const res = await fetchDataPageAndFilterProduct(
      null, // categoryId
      searchName, // Tìm kiếm theo tên
      null, // sleeveId
      null, // collarId
      brand, // brandId
      status, // Trạng thái
      page,
      pageSize
    );
    if (res.data) {
      setDataProduct(res.data.productResponseList);
      setPage(res.data.page);
      setPageSize(res.data.pageSize);
      setTotal(res.data.totalElement);
    }
  };

  // Hàm reset các bộ lọc về giá trị mặc định
  const handleReset = () => {
    setSearchName("");
    setStatus("");
    setPage(1);
    setBrand("")
  };

  return (
    <>
      <h1 style={{ textAlign: "center" }}>QUẢN LÝ SẢN PHẨM</h1>
      <div style={{ margin: "20px" }}>
        <ProductForm loadProduct={loadProduct} />

        <div style={{ marginTop: "10px", marginBottom: "10px" }}>
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên sản phẩm"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)} // Cập nhật giá trị tìm kiếm
            style={{ width: 220 }}
          />
          <Select
            placeholder="Chọn trạng thái"
            value={status === "" ? undefined : status}
            onChange={(value) => setStatus(value)} // Cập nhật giá trị trạng thái
            style={{ width: 200, marginLeft: 10 }}
          >
            <Option value="1">Đang hoạt động</Option>
            <Option value="0">Ngừng hoạt động</Option>
          </Select>
          <Button onClick={handleReset} style={{ marginLeft: 10 }}>Reset</Button> {/* Nút reset */}
        </div>

        <ProductTable
          loadProduct={loadProduct}
          dataProduct={dataProduct}
          page={page}
          pageSize={pageSize}
          total={total}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </div>
    </>
  );
};

export default ProductPage;
