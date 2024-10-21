import PromotionForm from "../component/promotion/promotion.form";
import PromotionTable from "../component/promotion/promotion.table";
import { useEffect, useState } from "react";
import { fetchDataPromotion } from "../service/api.service";

const PromotionPage = () => {
    const [dataPromotion, setDataPromotion] = useState([]); // Dữ liệu khuyến mãi
    const [selectedPromotion, setSelectedPromotion] = useState(null); // Khuyến mãi cần chỉnh sửa

    // Hàm load dữ liệu khuyến mãi
    const loadData = async () => {
        try {

            const res = await fetchDataPromotion(); // Gọi API để lấy dữ liệu khuyến mãi
            console.log(res);
            setDataPromotion(res.data.data); // Cập nhật state với dữ liệu khuyến mãi


        } catch (error) {
            console.error("Error fetching promotions:", error); // Ghi log lỗi nếu có
        }
    };

    useEffect(() => {
        loadData(); // Tải dữ liệu khi component được mount
    }, []);

    return (
        <>
            <PromotionForm
                loadData={loadData} // Truyền hàm load lại dữ liệu sau khi thêm/sửa
                promotion={selectedPromotion} // Truyền khuyến mãi cần chỉnh sửa
                onReset={() => setSelectedPromotion(null)} // Reset khuyến mãi sau khi hoàn tất cập nhật
            />
            <PromotionTable
                loadData={loadData} // Truyền hàm load lại dữ liệu sau khi xóa
                dataPromotion={dataPromotion} // Dữ liệu khuyến mãi
                onEdit={setSelectedPromotion} // Truyền hàm xử lý chỉnh sửa
            />
        </>
    );
};

export default PromotionPage;
