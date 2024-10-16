import ProductForm from "../component/product/product.form";
import ProductTable from "../component/product/product.table";
import { fetchAllProduct } from "../service/api.service";
import { useEffect, useState } from "react";

const ProductPage = () => {
  const [dataProduct, setDataProduct] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  // const [listProductCode, setListProductCode] = useState([]);
  const [allProductCodes, setAllProductCodes] = useState([]); // Danh sách tất cả mã sản phẩm

  useEffect(() => {
    loadProduct();
  }, [page, pageSize]);

  const loadProduct = async () => {
    const res = await fetchAllProduct(page, pageSize);
    if (res.data) {
      setDataProduct(res.data.productResponseList);
      setPage(res.data.page);
      setPageSize(res.data.pageSize);
      setTotal(res.data.totalElement);

      const currentProductCodes = res.data.productResponseList.map(
        (value) => value.code
      );
      // setListProductCode(currentProductCodes);
      setAllProductCodes((prevCodes) => [
        ...new Set([...prevCodes, ...currentProductCodes]), // Kết hợp và loại bỏ trùng lặp
      ]);
    }
  };

  console.log("check all product codes", allProductCodes);

  return (
    <>
      <div style={{ margin: "20px" }}>
        <ProductForm
          allProductCodes={allProductCodes}
          // setListProductCode={setListProductCode}
          loadProduct={loadProduct}
        />
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
