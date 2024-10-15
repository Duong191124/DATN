import { useEffect, useState } from "react";
import { fetchDataBrandAPI } from "../service/api.service";
import BrandForm from "../component/brand/brand.form";
import BrandTable from "../component/brand/brand.table";
import { Button } from "antd";
import { Link } from "react-router-dom";

const BrandPage = () => {
  const [dataBrand, setDataBrand] = useState("");
  const [listCode, setListCode] = useState("");
  const [listName, setListName] = useState("");

  const loadBrand = async () => {
    const res = await fetchDataBrandAPI();
    setDataBrand(res.data.data);
    setListCode(res.data.map((brand) => brand.code));
    setListName(res.data.map((brand) => brand.name));
  };

<<<<<<< HEAD
    const loadBrand = async () => {
        const res = await fetchDataBrandAPI()
        setDataBrand(res.data)
        setListCode(res.data.map(brand => brand.code))
        setListName(res.data.map(brand => brand.name))

    }

    useEffect(() => {
        loadBrand()
    }, [])
    return (
        <div style={{ margin: "20px" }}>
            <BrandForm
                loadBrand={loadBrand}
                listCode={listCode}
                listName={listName}
            />
            <BrandTable
                loadBrand={loadBrand}
                dataBrand={dataBrand}
            />
            <Button type="primary"><Link to="/products">Go to product</Link></Button>
        </div>
    )
}
export default BrandPage
=======
  useEffect(() => {
    loadBrand();
  }, []);
  return (
    <div style={{ margin: "20px" }}>
      <BrandForm
        loadBrand={loadBrand}
        listCode={listCode}
        listName={listName}
      />
      <BrandTable loadBrand={loadBrand} dataBrand={dataBrand} />
    </div>
  );
};
export default BrandPage;
>>>>>>> 5a2884cd93aeab05ed8ca0cc21e068ede8cb0a9c
