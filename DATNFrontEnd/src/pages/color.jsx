import ColorForm from "../component/color/color.form";
import ColorTable from "../component/color/color.table";
import { useEffect, useState } from "react";
import { fetchDataColor } from "../service/api.service";


const ColorPage = () => {
  const [dataColor, setDataColor] = useState([]);
  const [listName, setListName] = useState([]); // Danh sách tên đã tồn tại
  const [listCode, setListCode] = useState([]);
  const loadColor = async () => {
    const res = await fetchDataColor();
    setDataColor(res.data.data);
    setListName(res.data.map((color) => color.name)); // Cập nhật danh sách tên từ dữ liệu màu
    setListCode(res.data.map((color) => color.code));
  };

  useEffect(() => {
    loadColor();
  }, []);
  return (
    <div style={{ margin: "20px" }}>
      <ColorForm
        loadColor={loadColor}
        listName={listName} // Truyền danh sách tên đã tồn tại vào ColorForm
        listCode={listCode}
      />
      <ColorTable loadColor={loadColor} dataColor={dataColor} />
    </div>
  );
};

export default ColorPage;
