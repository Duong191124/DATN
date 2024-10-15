import ColorForm from "../component/color/color.form";
import ColorTable from "../component/color/color.table";
import { useEffect, useState } from "react";
import { fetchDataColor } from "../service/api.service";
import { Button } from "antd";
import { Link } from "react-router-dom";

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

<<<<<<< HEAD

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
            <ColorTable
                loadColor={loadColor}
                dataColor={dataColor}
            />
            <Button type="primary"><Link to="/products">Go to product</Link></Button>
        </div>
    );
=======
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
>>>>>>> 5a2884cd93aeab05ed8ca0cc21e068ede8cb0a9c
};

export default ColorPage;
