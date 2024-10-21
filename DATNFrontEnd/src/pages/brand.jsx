import { useEffect, useState } from "react";
import { fetchDataBrandAPI } from "../service/api.service";
import BrandForm from "../component/brand/brand.form";
import BrandTable from "../component/brand/brand.table";


const BrandPage = () => {
  const [dataBrand, setDataBrand] = useState("");

  const loadBrand = async () => {
    const res = await fetchDataBrandAPI();
    setDataBrand(res.data.data);
  };


  useEffect(() => {
    loadBrand();
  }, []);
  return (
    <div style={{ margin: "20px" }}>
      <BrandForm
        loadBrand={loadBrand}
      />
      <BrandTable loadBrand={loadBrand} dataBrand={dataBrand} />
    </div>
  );
};
export default BrandPage;
