import { useParams } from "react-router-dom";
import ProDuctDetailForm from "../component/product.detail/product.detail.form";
import ProductDetailTable from "../component/product.detail/product.detail.table";
import { findByProductId } from "../service/api.service";
import { useEffect, useState } from "react";

const ProductDetail = () => {
  const [dataProductDetail, setDataProductDetail] = useState([]);
  const { productId } = useParams();

  const loadProductDetail = async () => {

    const res = await findByProductId(productId);
    if (res.data.data.details) {
      setDataProductDetail(res.data.data.details);
    }
  };

  useEffect(() => {
    loadProductDetail();
  }, [productId]);

  return (
    <div style={{ margin: "20px" }}>
      <ProDuctDetailForm loadProductDetail={loadProductDetail} productId={productId} />
      <ProductDetailTable
        loadProductDetail={loadProductDetail}
        dataProductDetail={dataProductDetail}
      />
    </div>
  );
};

export default ProductDetail;
