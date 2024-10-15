import ProDuctDetailForm from "../component/product.detail/product.detail.form";
import ProductDetailTable from "../component/product.detail/product.detail.table";
import { fetchDataProductDetail } from "../service/api.service";
import { useEffect, useState } from "react";

const ProductDetail = () => {
  const [dataProductDetail, setDataProductDetail] = useState("");

  const loadProductDetail = async () => {
    const res = await fetchDataProductDetail();
    console.log("dfadfaf", res.data);
    setDataProductDetail(res.data.data);
  };
  useEffect(() => {
    loadProductDetail();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <ProDuctDetailForm loadProductDetail={loadProductDetail} />
      <ProductDetailTable
        loadProductDetail={loadProductDetail}
        dataProductDetail={dataProductDetail}
      />
    </div>
  );
};
export default ProductDetail;
