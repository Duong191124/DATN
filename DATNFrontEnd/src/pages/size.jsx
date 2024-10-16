import { useEffect, useState } from "react";
import { fetchDataSizeAPI } from "../service/api.service";
import SizeForm from "../component/size/size.form";
import SizeTable from "../component/size/size.table";


const SizePage = () => {
  const [dataSize, setDataSize] = useState("");
  const [listSizeCode, setListSizeCode] = useState([]);
  const [listSizeName, setListSizeName] = useState([]);
  const loadSize = async () => {
    const res = await fetchDataSizeAPI();
    setDataSize(res.data.data);
    setListSizeCode(res.data.map((size) => size.code));
    setListSizeName(res.data.map((size) => size.name));
  };


  useEffect(() => {
    loadSize();
  }, []);
  return (
    <div style={{ margin: "20px" }}>
      <SizeForm
        loadSize={loadSize}
        listSizeCode={listSizeCode}
        listSizeName={listSizeName}
      />
      <SizeTable loadSize={loadSize} dataSize={dataSize} />
    </div>
  );
};
export default SizePage;
