import { useEffect, useState } from "react";
import { fetchDataCategoryAPI } from "../service/api.service";
import CategoryForm from "../component/category/category.form";
import CategoryTable from "../component/category/category.table";


const CategoryPage = () => {


  const [dataCategory, setDataCategory] = useState("");

  const loadCategory = async () => {
    const res = await fetchDataCategoryAPI();
    setDataCategory(res.data.data);

  };

  useEffect(() => {
    loadCategory();
  }, []);
  return (
    <div style={{ margin: "20px" }}>
      <h1 style={{ textAlign: "center" }}>CATEGORY MANAGEMENT</h1>
      <CategoryForm loadCategory={loadCategory} />
      <CategoryTable loadCategory={loadCategory} dataCategory={dataCategory} />
    </div>
  );
};
export default CategoryPage;
